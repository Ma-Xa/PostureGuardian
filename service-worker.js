// service-worker.js

self.addEventListener('fetch', function(event) {
    // Пустой обработчик события 'fetch', чтобы Service Worker продолжал работать даже при сворачивании вкладки
  });
  
  self.addEventListener('message', function(event) {
    if (event.data === 'start') {
      self.skipWaiting();
    }
  });
  