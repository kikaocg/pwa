(function () {
    'use strict';
    var CACHE_SHELL = 'pwa-news-shell-v1';
    var CACHE_DATA = 'pwa-news-data-v1';
    var API = 'https://www.eventbriteapi.com/v3';
    var FILES_SHELL = [
        '/',
        '/css/bootstrap.min.css',
        '/css/core.css',
        '/css/main.css',
        '/js/api.js',
        '/library/bootstrap.min.js',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js',
        '/library/firebase.js'
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

}());