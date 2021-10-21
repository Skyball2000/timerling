/* function to load a json object from the localStorage */
function loadJSON(key) {
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/* function to save a json object to the localStorage */
function saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/* function to delete a json object from the localStorage */
function deleteJSON(key) {
    localStorage.removeItem(key);
}

/* function to check if a localStorage key exists */
function checkLocalStorageKey(key) {
    try {
        return 'localStorage' in window && window['localStorage'] !== null && localStorage.getItem(key) !== null;
    } catch (e) {
        return false;
    }
}


/**
 * Generates a random UUID.
 * @returns {*} The generated UUID.
 */
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 *  function that encodes a string into base64.
 */
function convertToBase64(s) {
    return btoa(s);
}

/**
 *  function that decodes a string from base64.
 */
function convertFromBase64(s) {
    return atob(s);
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

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

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss Z';

function formatDate(momentDate) {
    return momentDate.format(DEFAULT_FORMAT);
}

function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}

async function httpGet(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    //return xmlHttp.responseText;
}

function restartCssAnimation(elementId) {
    document.getElementById(elementId).style.animation = 'none';
    setTimeout(() => {
        document.getElementById(elementId).style.animation = '';
    }, 0);
}

function urlWithoutFilename() {
    let href = window.location.href;
    return href.substring(0, href.lastIndexOf('/')) + "/";
}

function uniq(a) {
    let seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function untofu(str) {
    return str.replaceAll('Ã ́', '- Â ô').replaceAll('Å¡ ', 'š')
        .replaceAll('Â¤', '¤').replaceAll('Ã¶', 'ö').replaceAll('Å¢', 'Þ')
        .replaceAll('Â¦', '¦').replaceAll('Ã·', '÷').replaceAll('Å£', 'þ')
        .replaceAll('Â§', '§').replaceAll('Ãº', 'ú').replaceAll('Å¤', '?')
        .replaceAll('Â ̈', ' ̈').replaceAll('Ã¼', 'ü').replaceAll('Å¥', '?')
        .replaceAll('Â©', '©').replaceAll('Ã½', 'ý').replaceAll('Å®', 'Ù')
        .replaceAll('Â«', '«').replaceAll('Ä‚', 'Ã').replaceAll('Å ̄', 'ù')
        .replaceAll('Â¬', '¬').replaceAll('Äƒ', 'ã').replaceAll('Å°', 'Û')
        .replaceAll('Â-', '-').replaceAll('Ä„', '¥').replaceAll('Å±', 'û')
        .replaceAll('Â®', '®').replaceAll('Ä...', '¹').replaceAll('Å¹', '?')
        .replaceAll('Â°', '°').replaceAll('Ä†', 'Æ').replaceAll('Åº', 'Ÿ')
        .replaceAll('Â±', '±').replaceAll('Ä‡ ', 'æ').replaceAll('Å»', '̄')
        .replaceAll('Â ́', ' ́').replaceAll('ÄŒ', 'È').replaceAll('Å¼', '¿')
        .replaceAll('Âμ', 'μ').replaceAll('Ä?', 'è').replaceAll('Å½', 'Ž')
        .replaceAll('Â¶', '¶').replaceAll('ÄŽ', 'Ï').replaceAll('Å¾', 'ž')
        .replaceAll('Â·', '·').replaceAll('Ä?', 'ï').replaceAll('Ë‡', '¡')
        .replaceAll('Â ̧', ' ̧').replaceAll('Ä?', 'Ð').replaceAll('Ë ̃', '¢')
        .replaceAll('Â»', '»').replaceAll('Ä‘', 'ð').replaceAll('Ë™', 'ÿ')
        .replaceAll('Ã?', 'Á').replaceAll('Ä ̃', 'Ê').replaceAll('Ë›', '²')
        .replaceAll('Ã‚', 'Â').replaceAll('Ä™', 'ê').replaceAll('Ë?', '½')
        .replaceAll('Ã„', 'Ä').replaceAll('Äš', 'Ì').replaceAll('â€“', '–')
        .replaceAll('Ã‡', 'Ç').replaceAll('Ä›', 'ì').replaceAll('â€”', '—')
        .replaceAll('Ã‰', 'É').replaceAll('Ä¹', 'Å').replaceAll('â€ ̃', '‘')
        .replaceAll('Ã‹', 'Ë').replaceAll('Äº', 'å').replaceAll('â€™', '’')
        .replaceAll('Ã?', 'Í').replaceAll('Ä½', '¼').replaceAll('â€š', '‚')
        .replaceAll('ÃŽ', 'Î').replaceAll('Ä¾', '¾').replaceAll('â€œ', '“')
        .replaceAll('Ã“', 'Ó').replaceAll('Å?', '£').replaceAll('â€?', '”')
        .replaceAll('Ã”', 'Ô').replaceAll('Å‚', '³').replaceAll('â€ž', '„')
        .replaceAll('Ã–', 'Ö').replaceAll('Åƒ', 'Ñ').replaceAll('â€', '†')
        .replaceAll('Ã—', '×').replaceAll('Å„', 'ñ').replaceAll('â€¡', '‡')
        .replaceAll('Ãš', 'Ú').replaceAll('Å‡', 'Ò').replaceAll('â€¢', '•')
        .replaceAll('Ãœ', 'Ü').replaceAll('Åˆ', 'ò').replaceAll('â€¦', '...')
        .replaceAll('Ã?', 'Ý').replaceAll('Å?', 'Õ').replaceAll('â€°', '‰')
        .replaceAll('ÃŸ', 'ß').replaceAll('Å‘', 'õ').replaceAll('â€¹', '‹')
        .replaceAll('Ã¡', 'á').replaceAll('Å”', 'À').replaceAll('â€º', '›')
        .replaceAll('Ã¢', 'â').replaceAll('Å•', 'à').replaceAll('â‚¬', '€')
        .replaceAll('Ã¤', 'ä').replaceAll('Å ̃', 'Ø').replaceAll('â„¢', '™')
        .replaceAll('Ã§', 'ç').replaceAll('Å™', 'ø').replaceAll('Ã©', 'é')
        .replaceAll('Åš', 'Œ').replaceAll('Ã«', 'ë').replaceAll('Å›', 'œ')
        .replaceAll('Ã-', 'í').replaceAll('Åž', 'ª').replaceAll('Ã®', 'î')
        .replaceAll('ÅŸ', 'º').replaceAll('Ã³', 'ó').replaceAll('Å', 'Š')
        .replaceAll('Ã', 'Ü').replaceAll('Ã', 'Ö').replaceAll('Ã', 'Ä');
}