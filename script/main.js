let updateInterval;

let timestamp = getUrlParameter('t');
if (timestamp === "2021-09-28 10:00:00 +00:00" || timestamp === "2021-09-28%2010%3A00%3A00%20%2B00%3A00") {
    window.location.href = urlWithoutFilename();
}

function init(mode) {
    // make the user agree to the localStorage first
    if (areCookiesConfirmed()) {
        showCookieModal();
        return;
    }
    try {
        httpGet('http://yanwittmann.de/projects/countapi/hit.php?key=seen&namespace=timerling');
    } catch (e) {
    }


    // check what page has been opened
    if (mode === 0) { // grouped view
        // load the timers stored in the localStorage
        checkIfURLContainsTimerAndAddIt();
        updateTimers(getLocalStorageTimerData());
        updateInterval = setInterval(function () {
            updateTimers(getLocalStorageTimerData());
        }, 500);


        // add listeners for the modals
        document.addEventListener("keyup", function (event) {
            if (event.keyCode === 27) {
                event.preventDefault();
                cancelModifyTimer();
            } else if (event.keyCode === 13) {
                event.preventDefault();
                confirmModifyTimer();
            }
        });

        document.getElementById("timer-editor").addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                cancelModifyTimer();
            }
        });

        document.addEventListener('long-press', function (e) {
            longPressed(e.target);
        });
    } else if (mode === 1) { // large view
        // load the timer from the UUID in the url
        updateInterval = setInterval(function () {
            loadLargeTimerFromUrlUUID();
        }, 1000);

        // make the fade restart when the user moves their mouse
        const mouseListener = function () {
            restartCssAnimation('top-icons');
        };
        document.addEventListener('mousemove', mouseListener, false);
    }
}

function longPressed(element) {
    let uuid = element.id;
    if (uuid == null || uuid === '')
        uuid = element.parentElement.id;
    console.log(element);
    switchFromGroupedToLarge(uuid, true);
}