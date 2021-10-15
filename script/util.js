function detectBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) {
        return 'IE';
    } else {
        return 'Unknown';
    }
}

function getUrlParameter(key) {
    let params = (new URL(document.location)).searchParams;
    return params.get(key);
}

function millisecondDiffToNow(time) {
    return time.diff(moment());
}

function utcToLocal(utc) {
    let offset = new Date().getTimezoneOffset() * -1;
    return moment(utc).add(offset, 'minutes');
}

function getUtcValue(localDateTime) {
    return moment(localDateTime).utc();
}

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss Z';

function formatDate(momentDate) {
    return momentDate.format(DEFAULT_FORMAT);
}

function formatMilliseconds(ms, format) {
    if (format === 'ms') {
        return ms + ' ms';
    } else if (format === 'sec') {
        return Math.floor(ms / 1000) + ' sec';
    } else if (format === 'min') {
        return Math.floor(ms / 1000 / 60) + ' min';
    } else if (format === 'hr') {
        return Math.floor(ms / 1000 / 60 / 60) + ' hr';
    } else if (format === 'day') {
        if (Math.floor(ms / 1000 / 60 / 60 / 24) === 1)
            return Math.floor(ms / 1000 / 60 / 60 / 24) + ' day';
        else
            return Math.floor(ms / 1000 / 60 / 60 / 24) + ' days';
    } else if (format === 'smart') {
        if (Math.floor(ms / 1000 / 60 / 60 / 24) > 0) {
            return formatMilliseconds(ms, 'day');
        } else if (Math.floor(ms / 1000 / 60 / 60) > 0) {
            return formatMilliseconds(ms, 'hr');
        } else if (Math.floor(ms / 1000 / 60) > 0) {
            return formatMilliseconds(ms, 'min');
        }
        return formatMilliseconds(ms, 'sec');
    } else if (format === 'ow') {
        if (Math.floor(ms / 1000 / 60 / 22) === 1)
            return Math.floor(ms / 1000 / 60 / 22) + ' cycle';
        else
            return Math.floor(ms / 1000 / 60 / 22) + ' cycles';
    }
    return msToTime(ms);
}

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
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

    //  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
    if (days > 0)
        return days + ':' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}

function restartCssAnimation(elementId) {
    document.getElementById(elementId).style.animation = 'none';
    setTimeout(() => {
        document.getElementById(elementId).style.animation = '';
    }, 0);
}

async function httpGet(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    //return xmlHttp.responseText;
}
