(function () {
    'use strict';

    let city = 'campina+grande';
    const API = 'https://www.eventbriteapi.com/v3/events/search';
    const API_TOKEN = '&token=CUEVB3VAZGOJSXC2MFCU';

    getEventNews();

    let permissionNotification = false;
    let btnAlert = document.getElementById('btn-alert');
    let notificationIcon = document.getElementById('notification-icon');

    btnAlert.onclick = function () {
        if (permissionNotification === "granted") {
            notificationIcon.src = './static/img/icons/bell_on.svg';
        } else {
            notificationIcon.src = './static/img/icons/bell_off.svg';
        }
    };

    if('Notification' in window) {
        permissionNotification = Notification.permission;
        if (permissionNotification === 'granted') {
            notificationIcon.src = '/static/img/icons/bell_on.svg';
        } else {
            notificationIcon.src = '/static/img/icons/bell_off.svg';
        }
    }

    let titlePage = document.getElementById('titlePage');
    window.addEventListener('online', handleStateChange);
    window.addEventListener('offline', handleStateChange);

    function handleStateChange() {
        let state = navigator.onLine ? 'online' : 'offline';
        if(state === "offline") {
            titlePage.innerHTML = "(Offline)";
        } else {
            titlePage.innerHTML = "(Online)";
        }
    }

    if("ondevicelight" in window){
        window.addEventListener("deviceLight", onUpdateDeviceLight);
    }else{
        console.log("Your device don't support deviceLight");
    }

    function onUpdateDeviceLight(event){
        let colorPart = Math.min(255, event.value).toFixed(0);
        document.getElementById("body").style.backgroundColor =
            "rgb(" + colorPart + ", " + colorPart + ", " + colorPart + ")";
    }

    function getEventNews() {
        const url = 'https://www.eventbriteapi.com/v3/events/search/' + getCity()+'&token=CUEVB3VAZGOJSXC2MFCU';
        const xhr = createCORSRequest('GET', url);
        if (!xhr) {
            return;
        }

        xhr.onload = function () {
            const text = JSON.parse(xhr.responseText);
            success(text);
        };

        xhr.onerror = function () {
            alert('Woops, there was an error making the request.');
        };

        xhr.send();
    }

    function getCity() {
        if (city) {
            return '?location.address=' + city
        }
        return 'campina+grande';
    }

    function createCORSRequest(method, url) {
        let xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest !== "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }

    function success(res) {
        const $events = $("#events");
        $events.empty();

        if (res.events.length) {
            for (let i = 0; i < res.events.length; i++) {
                $events.append(getNewsHtml(res.events[i]));
            }
        } else {
            $events.html("<p>Sorry, there are no upcoming events.</p>");
        }
    }

    function getNewsHtml(event) {
        let card = $('<div>').addClass('card col-lg-4 col-sm-4 col-md-6 mb-4');
        card = addImage(card);
        card = addBodyTitle(card);
        card = addBodyActions(card);

        return card;

        function addImage(card) {
            if (event.logo.original.url) {
                return card.append(
                    $('<img>')
                        .attr('src', event.logo.original.url)
                        .attr('alt', event.name.text)
                        .addClass('card-img-top')
                );
            }
            return card;
        }

        function addBodyTitle(card) {
            const eventStartTime = moment(event.start.local).format('D/M/YYYY h:mm A');
            const eventEndTime = moment(event.end.local).format('D/M/YYYY h:mm A');

            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<h5>').addClass('card-title').append(event.name.text))
                    .addClass('card-text').append($('<h6>').addClass('text-muted').append('Start: ').append(eventStartTime))
                    .addClass('card-text').append($('<h6>').addClass('text-muted').append('End: ').append(eventEndTime))
                // .append($('<p>').addClass('card-text').append(event.description.text))
            );
        }

        function addBodyActions(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body bg-light text-center')
                    .append($('<button>').append('See Details').addClass('btn btn-primary').attr('type', 'button'))
                    .click(function () {
                        window.open(event.url, '_blank');
                    })
            );
        }
    }
})();