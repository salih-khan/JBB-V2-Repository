// sw.js - Your Service Worker File

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

// Fetch event listener
self.addEventListener('fetch', (event) => {
    // Only respond to requests for your domain
    if (event.request.url.includes('jbb.foundation')) {
        event.respondWith(
            fetch(event.request).catch((error) => {
                console.error('Fetching failed:', error);
                // Optionally return a fallback response or cache hit
            })
        );
    }
    // For other requests (like Google Ads), fall back to the network
});
