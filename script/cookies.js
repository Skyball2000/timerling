function areCookiesConfirmed() {
    return localStorage.confirmCookies == null || localStorage.confirmCookies === 'null';
}

function showCookieModal() {
    showModal("confirm-cookies");
    timerElement = createElementFromHTML('' +
        '<div class="timer-selection-grid-element material-card bounding-hover background-color text-color center-text-vertical center-text-horizontal">' +
        '    <span style="line-height:25px;">' +
        '        Please accept the terms of use first. If no modal opened where you can confirm them, disable your extension that blocks cookie notifications.' +
        '    </span>' +
        '</div>');
    document.getElementById('timer-box-container').prepend(timerElement);
}

function acceptCookies() {
    if (localStorage.confirmCookies == null || localStorage.confirmCookies === 'null') {
        localStorage.confirmCookies = true;
        window.location.reload();
    }
}

function denyCookies() {
    alert('Thank you for your interest, but this service cannot provide it\'s functionality without you agreeing to it\'s terms.\nYou will now be redirected to the last page you visited.');
    history.back();
    window.close();
}