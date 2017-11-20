var cacheName = 'autoapp-panel-__TIMESTAMP__';
var filesToCache = [
    '/index.html',
    '/img/map-preload.jpg',
    '/img/shop-default.png',
    '/img/sidenav-header.png',
    '/img/icons/144.png',
    '/img/icons/192.png',
    '/img/icons/512.png',
    '/img/splash/768x1024.png',
    '/fonts/autoapp-icons/autoapp.eot',
    '/fonts/autoapp-icons/autoapp.svg',
    '/fonts/autoapp-icons/autoapp.ttf',
    '/fonts/autoapp-icons/autoapp.woff',
    '/fonts/iranian-sans/woff/IRANSansWeb.woff',
    '/fonts/iranian-sans/woff/IRANSansWeb_Black.woff',
    '/fonts/iranian-sans/woff/IRANSansWeb_Bold.woff',
    '/fonts/iranian-sans/woff/IRANSansWeb_Light.woff',
    '/fonts/iranian-sans/woff/IRANSansWeb_Medium.woff',
    '/fonts/iranian-sans/woff/IRANSansWeb_UltraLight.woff',
    '/fonts/iranian-sans/woff2/IRANSansWeb.woff2',
    '/fonts/iranian-sans/woff2/IRANSansWeb_Black.woff2',
    '/fonts/iranian-sans/woff2/IRANSansWeb_Bold.woff2',
    '/fonts/iranian-sans/woff2/IRANSansWeb_Light.woff2',
    '/fonts/iranian-sans/woff2/IRANSansWeb_Medium.woff2',
    '/fonts/iranian-sans/woff2/IRANSansWeb_UltraLight.woff2',
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
        'https://app.autoapp.ir/img/'
        // 'https://app.autoapp.ir/css/',
        // 'https://app.autoapp.ir/js/',
        // 'https://maps.googleapis.com/maps/api/staticmap'
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
