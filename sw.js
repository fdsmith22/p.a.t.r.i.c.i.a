// Neurlyn Service Worker
const CACHE_NAME = 'neurlyn-v1757965063'; // Force complete refresh
const urlsToCache = [
  './',
  './index.html',
  './styles/neurlyn.css',
  './styles/neurlyn-dark.css',
  './styles/neurlyn-enhancements.css',
  './styles/neurlyn-navigation.css',
  './styles/neurlyn-gamified.css',
  './js/neurlyn-integrated.js',
  './js/report-generator.js',
  './js/modules/task-controller.js',
  './js/modules/behavioral-tracker.js',
  './js/tasks/base-task.js',
  './js/tasks/likert.js',
  './js/tasks/risk-balloon.js',
  './assets/icons/icons.svg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});