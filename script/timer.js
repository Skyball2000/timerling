/**
 * Loads the stored timer data or creates an empty one if not existent.
 * @returns {null|any} A JSON array with the individual timers.
 */
function getLocalStorageTimerData() {
    if (!checkLocalStorageKey('timers')) {
        saveJSON('timers', JSON.parse('[]'));
    }
    return loadJSON('timers');
}

function getLocalStorageTimerJSON(uuid) {
    return getLocalStorageTimerData().find(x => x['i'] === uuid);
}

function getLocalStorageTimerJSONIndex(uuid) {
    let candidates = getLocalStorageTimerData();
    for (let i = 0; i < candidates.length; i++) {
        if (candidates[i]['i'] === uuid) return i;
    }
    return -1;
}

function updateTimers(timersJson) {
    for (let currentTimer of timersJson) {
        updateTimer(currentTimer);
    }
}

function updateTimer(timerJson) {
    let uuid = timerJson['i'];
    if (uuid == null) uuid = uuidv4();
    let name = timerJson['n'];
    let destination = timerJson['d'];
    let method = timerJson['m'];

    let timerElement = findTimerWithUUID(uuid);
    let titleElement = timerElement.getElementsByClassName('timer-title-element');
    let countdownElement = timerElement.getElementsByClassName('timer-countdown-element');
    for (let i = 0; i < titleElement.length; i++) {
        titleElement.item(i).innerHTML = name;
    }
    for (let i = 0; i < countdownElement.length; i++) {
        countdownElement.item(i).innerHTML = getRemainingTime(destination, method);
    }
}

function updateLargeTimer(timerJson) {
    let uuid = timerJson['i'];
    if (uuid == null) return;
    let name = timerJson['n'];
    let destination = timerJson['d'];
    let method = timerJson['m'];

    let timerElement = document.getElementById('large-countdown');
    timerElement.innerHTML = getRemainingTime(destination, method).replace(' remaining', '');

    document.getElementById('countdown-name').innerHTML = name;
    document.getElementById('countdown-name').classList.remove('hidden');

    let localMoment = utcToLocal(destination);
    document.getElementById('countdown-destination').innerHTML = formatDate(localMoment);
    document.getElementById('countdown-destination').classList.remove('hidden');

    document.getElementById('countdown-copy-link').classList.remove('hidden');
    document.getElementById('countdown-create-new').classList.remove('hidden');
}

function findTimerWithUUID(uuid) {
    let timerElement = document.getElementById(uuid);
    if (timerElement == null) {
        timerElement = createElementFromHTML('' +
            '<div id="' + uuid + '" class="timer-selection-grid-element material-card bounding-hover background-color text-color center-text-vertical center-text-horizontal timer-box" onclick="timerLeftClicked(\'' + uuid + '\');" oncontextmenu="timerRightClicked(\'' + uuid + '\');return false;" data-long-press-delay="600">' +
            '    <span class="adjust-text-size-smaller timer-title-element"></span>' +
            '    <span class="adjust-text-size-small timer-countdown-element"></span>' +
            '</div>');
        document.getElementById('timer-box-container').prepend(timerElement);
    }
    return timerElement;
}

function checkIfTimerExists(uuid) {
    let timerElement = document.getElementById(uuid);
    return timerElement != null;
}

function getRemainingTime(destination, method) {
    let localMoment = utcToLocal(destination);
    let ms = millisecondDiffToNow(localMoment);
    let isOverdue = ms < 0;
    if (isOverdue) ms = (ms * -1) + 700;
    let displayTime = formatMillisecondsWithMethod(ms, method);
    if (isOverdue) return displayTime + ' overdue';
    else return displayTime + ' remaining';
}

function formatMillisecondsWithMethod(ms, method) {
    if (method === 'ms') {
        return ms + ' ms';
    } else if (method === 'sec') {
        return Math.floor(ms / 1000) + ' sec';
    } else if (method === 'min') {
        return Math.floor(ms / 1000 / 60) + ' min';
    } else if (method === 'hr') {
        return Math.floor(ms / 1000 / 60 / 60) + ' hr';
    } else if (method === 'day') {
        if (Math.floor(ms / 1000 / 60 / 60 / 24) === 1)
            return Math.floor(ms / 1000 / 60 / 60 / 24) + ' day';
        else
            return Math.floor(ms / 1000 / 60 / 60 / 24) + ' days';
    } else if (method === 'smart') {
        if (Math.floor(ms / 1000 / 60 / 60 / 24) > 0) {
            return formatMillisecondsWithMethod(ms, 'day');
        } else if (Math.floor(ms / 1000 / 60 / 60) > 0) {
            return formatMillisecondsWithMethod(ms, 'hr');
        } else if (Math.floor(ms / 1000 / 60) > 0) {
            return formatMillisecondsWithMethod(ms, 'min');
        }
        return formatMillisecondsWithMethod(ms, 'sec');
    } else if (method === 'ow') {
        if (Math.floor(ms / 1000 / 60 / 22) === 1)
            return Math.floor(ms / 1000 / 60 / 22) + ' cycle';
        else
            return Math.floor(ms / 1000 / 60 / 22) + ' cycles';
    }
    return msToTime(ms);
}

function msToTime(s) {
    // pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    s = (s - mins) / 60;
    let hrs = s % 24;
    s = (s - hrs) / 24;
    let days = s;

    if (days > 0)
        return days + ':' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function utcToLocal(utc) {
    let offset = new Date().getTimezoneOffset() * -1;
    return moment(utc).add(offset, 'minutes');
}

function millisecondDiffToNow(time) {
    return time.diff(moment());
}

function timerRightClicked(uuid) {
    switchFromGroupedToLarge(uuid, true);
}

function timerLeftClicked(uuid) {
    if (currentTimerModificationUUID != null) return;
    modifyTimerIntent(uuid);
}

let currentTimerModificationUUID = null;

function modifyTimerIntent(uuid) {
    if (currentTimerModificationUUID != null) return;
    currentTimerModificationUUID = uuid;
    if (!checkIfTimerExists(uuid)) {
        loadDefaultDateTime();
        document.getElementById('input-countdown-name').value = '';
        document.getElementById('picker-display-mode').value = 'def';
        document.getElementById('btnCopyTimerInput').classList.add('hidden');
    } else {
        let existingTimer = getLocalStorageTimerJSON(uuid);
        let timerDestination = existingTimer['d'].replaceAll('%20', ' ').replaceAll('%3A', ':').replaceAll('%2B', '+');
        loadTimeDateFromString(timerDestination);
        document.getElementById('input-countdown-name').value = existingTimer['n'];
        document.getElementById('picker-display-mode').value = existingTimer['m'];
        document.getElementById('btnCopyTimerInput').classList.remove('hidden');
    }
    showModal('timer-editor');
}

function confirmModifyTimer() {
    if (currentTimerModificationUUID == null) return;
    hideModal('timer-editor');

    confirmModifyTimerSaveData();

    currentTimerModificationUUID = null;
}

function confirmModifyTimerSaveData() {
    let inputCountdownName = document.getElementById("input-countdown-name").value;
    let inputDateTime = document.getElementById('picker-datetime').value;
    let inputTimeZone = document.getElementById("picker-timezone").value;
    let inputDisplayType = document.getElementById("picker-display-mode").value;
    let inputTimeZoneMoment = moment.tz(inputDateTime, inputTimeZone);
    let inputUTCMoment = formatDate(inputTimeZoneMoment.utc());

    createOrUpdateJsonTimer(currentTimerModificationUUID, inputUTCMoment, inputCountdownName, inputDisplayType);
}

function copyTimerURL(isOpenLargeDirectly, timerJson) {
    if (timerJson == null)
        timerJson = getLocalStorageTimerJSON(currentTimerModificationUUID);

    let urlBuilder = '?t=' + timerJson['d'] + '&n=' + timerJson['n'] + '&m=' + timerJson['m'];
    if (isOpenLargeDirectly) urlBuilder = urlBuilder + '&l=true';
    urlBuilder = urlBuilder.replaceAll(' ', '%20').replaceAll(':', '%3A').replaceAll('+', '%2B');
    urlBuilder = urlWithoutFilename() + 'index.html' + urlBuilder;
    copyToClipboard(urlBuilder);

    currentTimerModificationUUID = null;
    if (!isOpenLargeDirectly)
        hideModal('timer-editor');
}

function deleteModifyTimer() {
    if (currentTimerModificationUUID == null) return;

    removeTimerJson(currentTimerModificationUUID);
    removeTimerDomElement(currentTimerModificationUUID);
    updateTimers(getLocalStorageTimerData());
    currentTimerModificationUUID = null;
    hideModal('timer-editor');
}

function removeTimerDomElement(uuid) {
    document.getElementById('timer-box-container').removeChild(findTimerWithUUID(uuid));
}

function removeDuplicateTimers() {
    let names = [];
    let destinations = [];

    let newConfigArray = JSON.parse('[]');
    let currentConfigs = getLocalStorageTimerData();
    for (let i = 0; i < currentConfigs.length; i++) {
        let currentName = currentConfigs[i]['n'];
        let currentDestination = currentConfigs[i]['n'];
        let found = false;
        for (let i = 0; i < names.length; i++) {
            if (names[i] === currentName && destinations[i] === currentDestination) {
                found = true;
            }
        }
        if (found) continue;
        names.push(currentName);
        destinations.push(currentDestination);
        newConfigArray.push(currentConfigs[i]);
    }
    saveJSON('timers', newConfigArray);
    completeRefreshOfGroupedTimers();
}

function findReplacementTimer(name, destination) {
    let currentConfigs = getLocalStorageTimerData();
    for (let i = 0; i < currentConfigs.length; i++) {
        let currentName = currentConfigs[i]['n'];
        let currentDestination = currentConfigs[i]['d'];
        if (currentName === name && currentDestination === destination)
            return currentConfigs[i]['i'];
    }
    return null;
}

function completeRefreshOfGroupedTimers() {
    if (!document.getElementById('timer-box-container')) return;
    let elements = document.getElementsByClassName('timer-box');
    for (let i = 0; i < elements.length; i++) {
        document.getElementById('timer-box-container').removeChild(elements[i]);
    }
    updateTimers(getLocalStorageTimerData());
}

function removeTimerJson(uuid) {
    let timerConfigIndex = getLocalStorageTimerJSONIndex(uuid);
    let newConfigArray = JSON.parse('[]');
    let currentConfigs = getLocalStorageTimerData();
    for (let i = 0; i < currentConfigs.length; i++) {
        if (timerConfigIndex === i) continue;
        newConfigArray.push(currentConfigs[i]);
    }
    saveJSON('timers', newConfigArray);
    return newConfigArray;
}

function createOrUpdateJsonTimer(uuid, formattedDestination, name, method) {
    let timerConfig = getLocalStorageTimerJSON(uuid);
    let newConfigArray = removeTimerJson(uuid);

    // check if the timer already exists or if a new one has to be created
    if (timerConfig) {
        timerConfig['n'] = name;
        timerConfig['d'] = formattedDestination;
        timerConfig['m'] = method;
    } else {
        timerConfig = JSON.parse("{}");
        timerConfig['i'] = uuid;
        timerConfig['n'] = name;
        timerConfig['d'] = formattedDestination;
        timerConfig['m'] = method;
        try {
            httpGet('http://yanwittmann.de/projects/countapi/hit.php?key=created&namespace=timerling');
        } catch (e) {
        }
    }
    newConfigArray.push(timerConfig);

    saveJSON('timers', newConfigArray);

    timerConfig = getLocalStorageTimerJSON(uuid);
    updateTimer(timerConfig);
}

function cancelModifyTimer() {
    currentTimerModificationUUID = null;
    hideModal('timer-editor');
}

function loadDefaultDateTime() {
    let currentMoment = moment().add(1, 'minutes');
    document.getElementById('picker-datetime').value = currentMoment.format('YYYY-MM-DDTHH:mm');
    loadTimeZoneList();
}

function loadTimeDateFromString(dateTime) {
    let currentMoment = utcToLocal(dateTime);
    document.getElementById('picker-datetime').value = currentMoment.format('YYYY-MM-DDTHH:mm');
    loadTimeZoneList();
}

function loadTimeZoneList() {
    let select = document.getElementById("picker-timezone");
    select.innerHTML = "";
    let browserTimeZone = moment.tz.guess();
    let timeZones = moment.tz.names();
    timeZones.forEach((timeZone) => {
        let option = document.createElement("option");
        option.textContent = `${timeZone} (GMT${moment.tz(timeZone).format('Z')})`;
        option.value = timeZone;
        if (timeZone === browserTimeZone) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function checkIfURLContainsTimerAndAddIt() {
    let name = getUrlParameter('n');
    let method = getUrlParameter('m');
    let destination = getUrlParameter('t');
    let large = getUrlParameter('l');

    if (method != null && destination != null) {
        let uuid = uuidv4();
        createOrUpdateJsonTimer(uuid, destination, name, method);
        removeDuplicateTimers();
        let replacementUUID = findReplacementTimer(name, destination);
        if (replacementUUID != null) uuid = replacementUUID;

        if (large != null) {
            switchFromGroupedToLarge(uuid, false);
        } else {
            window.location.href = window.location.href.split('?')[0];
        }
    }
}

function loadLargeTimerFromUrlUUID() {
    let uuid = getUrlParameter('i');

    if (uuid != null) {
        let timerJson = getLocalStorageTimerJSON(uuid);
        updateLargeTimer(timerJson);
    } else {
        switchFromLargeToGrouped();
    }
}

function copyLargeTimerLink() {
    let uuid = getUrlParameter('i');

    if (uuid != null) {
        let timerJson = getLocalStorageTimerJSON(uuid);
        copyTimerURL(true, timerJson);
    }
}

function switchFromLargeToGrouped() {
    let url = urlWithoutFilename() + 'index.html';
    window.location.href = url;
}

function switchFromGroupedToLarge(uuid, newTab) {
    let url = urlWithoutFilename() + 'large.html' + '?i=' + uuid;
    if (newTab && !detectMobile()) window.open(url, "_blank");
    else window.location.href = url;
}