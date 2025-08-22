/**
 * Web2Speech Service Worker
 * Provides offline capabilities and caching
 */

const CACHE_NAME = 'web2speech-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/styles.css',
  '/static/js/app.js',
  '/manifest.json',
  // Add icon paths when they exist
  '/static/icons/favicon.svg',
  '/static/icons/apple-touch-icon.png'
];

const DYNAMIC_CACHE = 'web2speech-dynamic-v1';

/**
 * Install event - cache static assets
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(asset => {
          // Only cache assets that actually exist
          return true; // For now, we'll handle 404s in fetch
        }));
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const deletionPromises = cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('web2speech-') && cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE;
          })
          .map(cacheName => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          });
        
        return Promise.all(deletionPromises);
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPICall(request)) {
    event.respondWith(handleAPICall(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/static/') || 
         url.pathname.endsWith('.css') || 
         url.pathname.endsWith('.js') || 
         url.pathname.endsWith('.png') || 
         url.pathname.endsWith('.svg') || 
         url.pathname.endsWith('.ico');
}

/**
 * Check if request is an API call
 */
function isAPICall(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

/**
 * Handle static asset requests - cache first strategy
 */
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch static asset:', error);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return new Response('Asset not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Handle API calls - network first with offline fallback
 */
async function handleAPICall(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses for offline access
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] API call failed, checking cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      error: 'Service unavailable offline',
      message: 'This feature requires an internet connection'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Handle page requests - cache first for main page, network first for others
 */
async function handlePageRequest(request) {
  try {
    // For the main page, use cache-first strategy
    if (request.url.endsWith('/') || request.url.includes('index.html')) {
      const cachedResponse = await caches.match('/');
      if (cachedResponse) {
        // Try to update cache in background
        fetch('/').then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put('/', response));
          }
        }).catch(() => {});
        
        return cachedResponse;
      }
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Page request failed, checking cache:', error);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve main page as fallback for navigation requests
    if (request.mode === 'navigate') {
      const mainPageCache = await caches.match('/');
      if (mainPageCache) {
        return mainPageCache;
      }
    }
    
    // Return offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web2Speech - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .offline-content {
            max-width: 400px;
          }
          .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          p {
            opacity: 0.9;
            line-height: 1.6;
          }
          .retry-button {
            margin-top: 2rem;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .retry-button:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="offline-content">
          <div class="offline-icon">🌐</div>
          <h1>You're Offline</h1>
          <p>Web2Speech isn't available right now. Please check your internet connection and try again.</p>
          <button class="retry-button" onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}

/**
 * Handle background sync for offline actions
 */
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'generate-speech') {
    event.waitUntil(handleOfflineSpeechGeneration());
  }
});

/**
 * Handle offline speech generation requests
 */
async function handleOfflineSpeechGeneration() {
  try {
    // Get pending requests from IndexedDB or localStorage
    // This would contain requests that were made while offline
    console.log('[SW] Processing offline speech generation requests');
    
    // For now, just log - in a real implementation, you'd:
    // 1. Get pending requests from storage
    // 2. Make API calls now that connection is restored
    // 3. Update the UI with results
    // 4. Clean up completed requests
    
  } catch (error) {
    console.error('[SW] Failed to process offline requests:', error);
  }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'Web2Speech',
    body: 'Your speech generation is complete!',
    icon: '/static/icons/icon-192x192.png',
    badge: '/static/icons/icon-96x96.png',
    tag: 'speech-complete',
    data: {
      url: '/'
    }
  };
  
  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (error) {
      console.error('[SW] Failed to parse push notification data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If the app is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

/**
 * Log service worker messages
 */
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Send response back to client
  event.ports[0]?.postMessage({
    type: 'SW_RESPONSE',
    success: true
  });
});

/**
 * Handle errors
 */
self.addEventListener('error', event => {
  console.error('[SW] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service worker loaded successfully');