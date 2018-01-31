var cacheName = 'autoapp-panel-__TIMESTAMP__';
var filesToCache = [
    '/index.html',
    '/img/bg-main.jpg',
    '/img/sidenav-header.jpg',
    '/img/vesta-logo.png',
    '/img/vesta-logo-white.png',
    '/img/icons/36x36.png',
    '/img/icons/48x48.png',
    '/img/icons/72x72.png',
    '/img/icons/96x96.png',
    '/img/icons/144x144.png',
    '/img/icons/192x192.png',
    '/img/splash/768x1024.jpg',
    '/img/splash/1024x768.jpg',
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] install');
    e.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                console.log('[ServiceWorker] Caching static files');
                return cache.addAll(filesToCache);
            })
            .then(function () {
                return self.skipWaiting();
            })
            .catch(function (error) {
                console.error('[ServiceWorker] install', error);
                self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            })).catch(function (error) {
                console.error('[ServiceWorker] activate', error);
            });
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(cacheName).then(function (cache) {
            return cache.match(event.request).then(function (cacheResponse) {
                if (cacheResponse) return cacheResponse;
                return fetch(event.request).then(function (response) {
                    if (shouldCache(event.request.url)) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            }).catch(function (error) {
                console.error('[ServiceWorker] fetch', error);
            });
        })
    );
});

function shouldCache(url) {
    var toCache = [
        'https://panel.vesta.bz/img/',
        'https://panel.vesta.bz/css/',
        'https://panel.vesta.bz/js/',
        'https://api.vesta.bz/upl/',
    ];
    for (var i = toCache.length; i--;) {
        if (url.indexOf(toCache[i]) > -1) return true;
    }
    return false;
}

// self.addEventListener('push', function (event) {
//     const title = event.data.text();
//     const options = {
//         title: event.data.text(),
//         body: 'Vesta',
//         icon: 'img/vesta-logo.png',
//     };
//     event.waitUntil(self.registration.showNotification(title, options));
// });
//
// self.addEventListener('notificationclick', function (event) {
//     event.notification.close();
//     event.waitUntil(
//         clients.openWindow(location.origin)
//     );
// });
