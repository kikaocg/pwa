(function () {
    'use strict';

    var city = 'campina+grande';
    var API = 'https://www.eventbriteapi.com/v3/events/search';
    var API_TOKEN = '&token=CUEVB3VAZGOJSXC2MFCU';

    getEventNews();

    function getEventNews() {
        var url = 'https://www.eventbriteapi.com/v3/events/search/?location.address=Campina+Grande&token=CUEVB3VAZGOJSXC2MFCU';

        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            return;
        }

        xhr.onload = function() {
            var text = JSON.parse(xhr.responseText);
            success(text);
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };

        xhr.send();
    }

    function getCity() {
        if (city) {
            return '?location.address=' + city
        }
        return '';
    }

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
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
        var $events = $("#events");
        $events.empty();

        if(res.events.length) {
            for(var i=0; i < res.events.length; i++) {
                $events.append(getNewsHtml(res.events[i]));
            }
        } else {
            $events.html("<p>Sorry, there are no upcoming events.</p>");
        }
    }

    function getNewsHtml(event) {
        var card = $('<div>').addClass('card col-lg-4 col-sm-4 col-md-6 mb-4');
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
            var eventStartTime = moment(event.start.local).format('D/M/YYYY h:mm A');
            var eventEndTime = moment(event.end.local).format('D/M/YYYY h:mm A');

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