var startUtcMoment = null;
var countdownName = null;

function createNewCountdown() {
    let dateTimeInput = getInputtedDateTime();
    let timeZoneValue = document.getElementById("picker-timezone").value;
    countdownName = document.getElementById("input-countdown-name").value;
    let timeZoneMoment = moment.tz(dateTimeInput, timeZoneValue);
    startUtcMoment = formatDate(timeZoneMoment.utc());
    refreshCountdown();
    setDisplayMode(2);
    httpGet('http://yanwittmann.de/projects/countapi/hit.php?key=created&namespace=timerling');
}

function getInputtedDateTime() {
    let browser = detectBrowser();
    if (browser === 'Firefox') {
        return document.getElementById('picker-date').value + 'T' + document.getElementById('picker-time').value;
    } else {
        return document.getElementById('picker-datetime').value;
    }
}

setInterval(function () {
    refreshCountdown();
}, 500);

function refreshCountdown() {
    if (startUtcMoment == null) return;
    let localMoment = utcToLocal(startUtcMoment);
    let ms = millisecondDiffToNow(localMoment);
    let isOverdue = ms < 0;
    if (isOverdue) ms = (ms * -1) + 700;
    let displayTime = formatMilliseconds(ms, document.getElementById('picker-output-format').value);
    if (isOverdue)
        displayTime = displayTime + ' overdue';
    else
        displayTime = displayTime + ' remaining';

    document.getElementById('output-countdown').innerHTML = displayTime;
    if (countdownName != null && countdownName.length > 0) {
        document.getElementById('output-countdown-name').innerHTML = countdownName;
        document.getElementById('output-countdown-name').classList.remove('hidden');
    } else document.getElementById('output-countdown-name').classList.add('hidden');

    //document.getElementById('output-dest-time').classList.remove('hidden');
    //document.getElementById('output-dest-time').innerHTML = startUtcMoment.replace('+00:00', 'UTC');
    document.getElementById('output-dest-time-local').classList.remove('hidden');
    document.getElementById('output-dest-time-local').innerHTML = formatDate(localMoment);
}

function setDisplayMode(mode) {
    document.getElementById('picker-date').classList.add('hidden');
    document.getElementById('picker-time').classList.add('hidden');
    document.getElementById('picker-datetime').classList.add('hidden');
    document.getElementById('input-countdown-name').classList.add('hidden');
    document.getElementById('btnSubmit').classList.add('hidden');
    document.getElementById('picker-timezone').classList.add('hidden');
    document.getElementById('splitter').classList.add('hidden');
    document.getElementById('output-countdown').classList.add('hidden');
    document.getElementById('bottom-left-hover').classList.add('hidden');
    document.getElementById('top-hover').classList.add('hidden');
    document.getElementById('output-countdown-name').classList.add('hidden');
    document.getElementById('output-dest-time').classList.add('hidden');
    document.getElementById('output-dest-time-local').classList.add('hidden');
    if (mode === 0) {
        document.getElementById('picker-date').classList.remove('hidden');
        document.getElementById('picker-time').classList.remove('hidden');
        document.getElementById('btnSubmit').classList.remove('hidden');
        document.getElementById('input-countdown-name').classList.remove('hidden');
        document.getElementById('picker-timezone').classList.remove('hidden');
        document.getElementById('splitter').classList.remove('hidden');
    } else if (mode === 1) {
        document.getElementById('picker-datetime').classList.remove('hidden');
        document.getElementById('btnSubmit').classList.remove('hidden');
        document.getElementById('input-countdown-name').classList.remove('hidden');
        document.getElementById('picker-timezone').classList.remove('hidden');
        document.getElementById('splitter').classList.remove('hidden');
    } else if (mode === 2) {
        document.getElementById('output-countdown').classList.remove('hidden');
        document.getElementById('bottom-left-hover').classList.remove('hidden');
        document.getElementById('top-hover').classList.remove('hidden');
    }
}

// link management
function copyLink() {
    let urlBuilder = window.location.href.split('?')[0];
    if (countdownName != null && countdownName.length > 0)
        copyToClipboard(urlBuilder + '?t=' + encodeURIComponent(startUtcMoment) + '&n=' + encodeURIComponent(countdownName) + '&m=' + document.getElementById('picker-output-format').value);
    else
        copyToClipboard(urlBuilder + '?t=' + encodeURIComponent(startUtcMoment) + '&m=' + document.getElementById('picker-output-format').value);
}

function createNew() {
    window.location.href = window.location.href.split('?')[0]
}

// detect mouse movement
const myListener = function () {
    restartCssAnimation('top-hover');
    restartCssAnimation('bottom-left-hover');
};

document.addEventListener('mousemove', myListener, false);

// initialization stuffs
function prepareForBrowser() {
    var browser = detectBrowser();
    if (browser === 'Firefox') { // firefox does not support datetime as input, split it up
        setDisplayMode(0);
    } else {
        setDisplayMode(1);
    }
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

function loadDefaultDateTime() {
    let currentMoment = moment().add(1, 'minutes');
    document.getElementById('picker-datetime').value = currentMoment.format('YYYY-MM-DDTHH:mm');
    document.getElementById('picker-date').value = currentMoment.format('YYYY-MM-DD');
    document.getElementById('picker-time').value = currentMoment.format('HH:mm');
}

function init() {
    let timestamp = getUrlParameter('t');
    if (timestamp === "2021-09-28 10:00:00 +00:00" || timestamp === "2021-09-28%2010%3A00%3A00%20%2B00%3A00") {
        //timestamp = "2021-09-28 16:22:00 +00:00";
        createNew();
    }
    if (timestamp != null && timestamp.length > 0) {
        startUtcMoment = timestamp;
        countdownName = getUrlParameter('n');
        if (getUrlParameter('m') != null)
            document.getElementById('picker-output-format').value = getUrlParameter('m');
        console.log(countdownName);
        setDisplayMode(2);
    } else {
        prepareForBrowser();
    }
    loadDefaultDateTime();
    loadTimeZoneList();
    httpGet('http://yanwittmann.de/projects/countapi/hit.php?key=seen&namespace=timerling');
}

init();
