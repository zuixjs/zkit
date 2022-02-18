/* eslint-disable quotes */
(function() {
  zuix.store('config', {
    "title": "<code>zKit</code> components v1.1",
    "subtitle": "web enhancing bits",
    "googleSiteId": "UA-123-456",
    "baseUrl": "/zkit/",
    "resourcePath": "/app/",
    "libraryPath": {
      "@lib": "https://zuixjs.github.io/zkit/lib/",
      "@hgui": "https://genielabs.github.io/homegenie-web-ui/app/",
      "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
    },
    "zuixjs.github.io": {
      "resourcePath": "/zkit/app/",
      "libraryPath": {
        "@lib": "https://zuixjs.github.io/zkit/lib/",
        "@hgui": "https://genielabs.github.io/homegenie-web-ui/app/",
        "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
      }
    }
  });
  // Check that service workers are registered
  const app = zuix.store('config');
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(app.baseUrl + 'service-worker.js');
    });
  }
})();
