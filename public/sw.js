const CACHE_NAME = 'patricia-v2.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/styles/main.css',
  '/src/data/archetypes.js',
  '/src/modules/visualization3D.js',
  '/src/modules/gamification.js',
  '/src/modules/soundSystem.js',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Network First, Cache Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response before caching
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Background Sync for saving results
self.addEventListener('sync', event => {
  if (event.tag === 'save-results') {
    event.waitUntil(saveResultsToServer());
  }
});

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New personality insight available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore insights',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('P.A.T.R.I.C.I.A', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app to insights page
    event.waitUntil(
      clients.openWindow('/?view=insights')
    );
  }
});

// Periodic Background Sync for achievements check
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-achievements') {
    event.waitUntil(checkNewAchievements());
  }
});

// Helper Functions
async function saveResultsToServer() {
  // Get results from IndexedDB
  const results = await getStoredResults();
  
  if (results && results.length > 0) {
    try {
      // Save to server (when backend is implemented)
      const response = await fetch('/api/save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      });
      
      if (response.ok) {
        // Clear local storage after successful sync
        await clearStoredResults();
      }
    } catch (error) {
      console.error('Failed to sync results:', error);
    }
  }
}

async function checkNewAchievements() {
  try {
    // Check for new achievements (when backend is implemented)
    const response = await fetch('/api/achievements/check');
    const data = await response.json();
    
    if (data.newAchievements && data.newAchievements.length > 0) {
      // Show notification for new achievements
      self.registration.showNotification('New Achievement Unlocked!', {
        body: `You've unlocked: ${data.newAchievements[0].name}`,
        icon: '/icons/achievement.png',
        badge: '/icons/badge-72x72.png',
        tag: 'achievement-notification',
        renotify: true
      });
    }
  } catch (error) {
    console.error('Failed to check achievements:', error);
  }
}

// IndexedDB helpers
async function getStoredResults() {
  // Implementation for getting results from IndexedDB
  return [];
}

async function clearStoredResults() {
  // Implementation for clearing results from IndexedDB
}

// Message handler for client communication
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(event.data.urls));
  }
});