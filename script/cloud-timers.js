function insertCloudTimer(owner, name, destination, method) {
    let parameters = new Map();
    parameters.set('owner', owner);
    parameters.set('name', convertToBase64(name));
    parameters.set('destination', convertToBase64(destination));
    parameters.set('method', convertToBase64(method));
    makePOSTRequest('http://yanwittmann.de/projects/timerlingsnapshot/php/create-timer.php', parameters, function (response) {
        console.log(response);
    });
}

function setActiveCollectionItem(collection) {
    localStorage.setItem('activeCollection', collection);
    syncCloudCollectionOutputs();
}

function removeCloudCollectionItem(collection) {
    collection = collection.replaceAll(';', ',');

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
        modalListElement.appendChild(createElementFromHTML('<span class="large-view-top-indicator unselectable ' + (entry !== activeCollection ? 'cloud-background-color cloud-text-color bounding-cloud-hover' : 'background-color text-color bounding-hover') + '" onclick="setActiveCollectionItem(\'' + entry + '\');" oncontextmenu="removeCloudCollectionItem(\'' + entry + '\'); return false;">' + entry + '</span>'));
    }
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
    if (getCollectionIdentifiers().length > 0) {

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