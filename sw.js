// sw.js - Your Service Worker File

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

// Fetch event listener
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch((error) => {
            console.error('Fetching failed:', error);
            throw error; // Let the browser handle the error
        })
    );
});