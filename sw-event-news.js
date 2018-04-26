(function () {
    'use strict';
    const CACHE_SHELL = 'pwa-news-shell-v1';
    const CACHE_DATA = 'pwa-news-data-v1';
    const API = 'https://www.eventbriteapi.com/v3';
    const FILES_SHELL = [
        '/',
        '/js/api.js',
        '/js/install-banner.js',
        '/js/push.js',
        '/library/bootstrap.min.js',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js',
        '/library/firebase.js',
        '/library/firebase.js.map',
        '/static/img/icons/bell_off.svg',
        '/static/img/icons/bell_on.svg',
        '/static/img/android-chrome-192x192.png',
        '/static/img/android-chrome-256x256.png',
        '/static/img/background.jpg',
        '/static/img/faviconEN.ico',
        '/static/img/logo.png'
    ];

    self.addEventListener('install', function (event) {
        event.waitUntil(
            self.caches.open(CACHE_SHELL).then(function (cache) {
                return cache.addAll(FILES_SHELL);
            })
        )
    });

    self.addEventListener('fetch', function (event) {
        if (event.request.url.indexOf(API) === -1) {
            event.respondWith(
                self.caches.match(event.request).then(
                    function (response) {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request);
                    }
                )
            )
        } else {
            event.respondWith(
                self.fetch (event.request).then(
                    function (response) {
                        return caches.open(CACHE_DATA).then(
                            function (cache) {
                                cache.put(event.request.url, response.clone());
                                return response;
                            }
                        )
                    }
                ).catch(function () {
                    return caches.match(event.request);
                })
            )
        }
    });

    self.addEventListener('activate', function(e) {
        console.log('[ServiceWorker] Activate');
        e.waitUntil(caches.keys().then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== CACHE_SHELL) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
        );
        return self.clients.claim();
    });

    //Push notification
    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        event.waitUntil(
            clients.openWindow('/')
        );
    });

    self.addEventListener('push', function (event) {
        const options = {
            body: event.data.text(),
            icon: 'static/img/logo.png',
            badge: 'static/img/logo.png'
        };
        event.waitUntil(
            self.registration.showNotification("Novo evento", options)
        );
    });

}());