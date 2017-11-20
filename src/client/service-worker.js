var cacheName = 'vesta-panel-__TIMESTAMP__';
var filesToCache = [
    '/index.html',
    '/img/bg-main.jpg',
    '/img/sidenav-header.jpg',
    '/img/vesta-logo.png',
    '/img/vesta-logo-white.png',
    '/img/icons/launcher-icon-0-75x.png',
    '/img/icons/launcher-icon-1-5x.png',
    '/img/icons/launcher-icon-1x.png',
    '/img/icons/launcher-icon-2x.png',
    '/img/icons/launcher-icon-3x.png',
    '/img/icons/launcher-icon-4x.png',
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== cacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(cacheName).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    if (shouldCache(event.request.url)) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            });
        })
    );
});

function shouldCache(url) {
    var toCache = [
        'https://app.vesta.bz/img/'
        // 'https://app.vesta.bz/css/',
        // 'https://app.vesta.bz/js/'
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
//         body: 'AutoApp',
//         icon: 'img/icons/512.png',
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
