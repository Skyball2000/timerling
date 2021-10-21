let cloudTimers = [];

function loadCloudTimers() {
    removeOnlineTimersFromHTML();
    cloudTimers = [];
    let parameters = new Map();
    let collections = getCollectionIdentifiers();
    for (let i = 0; i < collections.length; i++) {
        parameters.set('owner', collections[i]);
        makePOSTRequest('http://yanwittmann.de/projects/timerlingsnapshot/php/get-timers.php', parameters, function (response) {
            loadCloudTimersCallback(response);
        });
    }
}

function deleteOnlineTimer(uuid) {
    let parameters = new Map();
    parameters.set('uuid', uuid);
    makePOSTRequest('http://yanwittmann.de/projects/timerlingsnapshot/php/delete-timer.php', parameters, function (response) {
        loadCloudTimersCallback(response);
    });
}

function removeOnlineTimersFromHTML() {
    let timerBoxes = document.getElementsByClassName('online-timer-box');
    for (let i = 0; i < timerBoxes.length; i++) {
        document.getElementById('timer-box-container').removeChild(timerBoxes[i]);
    }
}

function loadCloudTimersCallback(response) {
    response = JSON.parse(response);
    if (response['reason'] === 'timerList') {
        response = response['details'];
        for (let i = 0; i < response.length; i++) {
            let newArr = [];
            newArr['i'] = convertFromBase64(response[i]['uuid']);
            newArr['o'] = convertFromBase64(response[i]['owner']);
            newArr['n'] = convertFromBase64(response[i]['name']);
            newArr['m'] = convertFromBase64(response[i]['method']);
            newArr['d'] = convertFromBase64(response[i]['destination']);
            cloudTimers.push(newArr);
        }
        updateTimers(cloudTimers, true);
    }
}

let currentOnlineTimerModificationUUID;

function modifyCloudTimerIntent(uuid) {
    if (currentTimerModificationUUID != null && currentOnlineTimerModificationUUID != null) return;
    document.getElementById('btnCopyTimerInput').classList.add('hidden');
    currentOnlineTimerModificationUUID = uuid;
    if (!checkIfTimerExists(uuid)) {
        loadDefaultDateTime();
        document.getElementById('input-countdown-name').value = '';
        document.getElementById('picker-display-mode').value = 'def';
        document.getElementById('btnCopyTimerInput').classList.add('hidden');
    } else {
        let existingTimer = cloudTimers.find(t => t['i'] === uuid);
        let timerDestination = existingTimer['d'].replaceAll('%20', ' ').replaceAll('%3A', ':').replaceAll('%2B', '+');
        loadTimeDateFromString(timerDestination);
        document.getElementById('input-countdown-name').value = untofu(existingTimer['n']);
        document.getElementById('picker-display-mode').value = existingTimer['m'];
    }
    showModal('timer-editor');
}

function insertOrUpdateCloudTimer(uuid, owner, destination, name, method) {
    let parameters = new Map();
    parameters.set('uuid', uuid);
    parameters.set('owner', owner);
    parameters.set('name', name);
    parameters.set('destination', destination);
    parameters.set('method', method);
    makePOSTRequest('http://yanwittmann.de/projects/timerlingsnapshot/php/create-or-modify-timer.php', parameters, function (response) {
    });
}

function editCloudTimer(uuid) {

}

function setActiveCollectionItem(collection) {
    localStorage.setItem('activeCollection', collection);
    syncCloudCollectionOutputs();
}

function removeCloudCollectionItem(collection) {
    collection = collection.replaceAll(';', ',');

    if (localStorage.getItem('activeCollection') === collection) {
        localStorage.removeItem('activeCollection');
    }

    let currentCollections = getCollectionIdentifiers();
    currentCollections.splice(currentCollections.indexOf(collection), 1);

    localStorage.setItem('cloudCollections', currentCollections.join(';'));
    syncCloudCollectionOutputs();
}

function addCloudCollectionItem(collection) {
    collection = collection.replaceAll(';', ',');

    let currentCollections = getCollectionIdentifiers();
    currentCollections.push(collection);

    localStorage.setItem('cloudCollections', currentCollections.join(';'));
    syncCloudCollectionOutputs();
}

function syncCloudCollectionOutputs() {
    let collectionIdentifiers = getCollectionIdentifiers();
    let activeCollection = localStorage.getItem('activeCollection');
    let modalListElement = document.getElementById('output-current-collections');
    modalListElement.innerHTML = '';

    for (let i = 0; i < collectionIdentifiers.length; i++) {
        let entry = collectionIdentifiers[i];
        modalListElement.appendChild(createElementFromHTML('<span class="collection-identifier large-view-top-indicator unselectable ' + (entry !== activeCollection ? 'cloud-background-color cloud-text-color bounding-cloud-hover' : 'background-color text-color bounding-hover') + '" onclick="setActiveCollectionItem(\'' + entry + '\');" oncontextmenu="removeCloudCollectionItem(\'' + entry + '\'); return false;" data-long-press-delay="600">' + entry + '</span>'));
    }

    addCloudTimerElementsIfHasCollections();
}

function getCollectionIdentifiers() {
    if (localStorage.getItem('cloudCollections') != null && localStorage.getItem('cloudCollections') !== `null`) {
        let value = localStorage.getItem('cloudCollections');
        value.replaceAll('null', '');
        value = uniq(value.split(';').filter(function (e) {
            return e != null && e.length > 0;
        }));
        return value;
    }
    return [];
}

function addCloudTimerElementsIfHasCollections() {
    let collections = getCollectionIdentifiers();
    if (collections.length > 0 && collections.includes(localStorage.getItem('activeCollection'))) {
        document.getElementById('add-new-cloud-countdown').classList.remove('hidden');
    } else {
        document.getElementById('add-new-cloud-countdown').classList.add('hidden');
    }
}

/**
 * A JavaScript function that makes a request to an url and passes POST parameters.
 * Then it returns the response.
 * @param url The URL to make to request to.
 * @param parametersMap A map containing the POST parameters.
 * @param callback The function to call after the response arrived.
 */
function makePOSTRequest(url, parametersMap, callback) {
    let http = new XMLHttpRequest();
    let params = '';
    for (const [key, value] of parametersMap.entries()) {
        if (params.length > 0) params = params + '&';
        params = params + key + '=' + value;
    }
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            callback(http.responseText);
        }
    }
    http.send(params);
}