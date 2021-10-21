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
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}