self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
  });
  