FimportScripts('workbox-v3.0.0-alpha.6/workbox-sw.js')

self.workbox.skipWaiting();
self.workbox.clientsClaim();

/*
  This is our code to handle push events.
*/
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Notification';
  const options = {
    body: `${event.data.text()}`,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

var CACHE_NAME = 'static-cache';
var urlsToCache = [
    '.',
    'index.html',
    'styles/main.css'
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetchAndCache(event.request);
            })
    );
});

function fetchAndCache(url) {
    return fetch(url)
        .then(function (response) {
            // Check if we received a valid response
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return caches.open(CACHE_NAME)
                .then(function (cache) {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch(function (error) {
            console.log('Request failed:', error);
            // You could return a custom offline 404 page here
        });
}

self.workbox.precaching.precacheAndRoute([]);