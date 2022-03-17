/* eslint-disable quotes */
(function() {
  zuix.store('config', {
    "title": "<code>zKit</code> components v1.1",
    "subtitle": "web enhancing bits",
    "googleSiteId": "UA-116384214-1",
    "siteMapUrl": "https://zuixjs.github.io/zkit",
    "baseUrl": "/zkit/",
    "resourcePath": "/zkit/app/",
    "libraryPath": {
      "@lib": "/zkit/lib/1.1/",
      "@hgui": "https://genielabs.github.io/homegenie-web-ui/app/",
      "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
    },
    "zuixjs.github.io": {
      "resourcePath": "/zkit/app/",
      "libraryPath": {
        "@lib": "/zkit/lib/1.1/",
        "@hgui": "https://genielabs.github.io/homegenie-web-ui/app/",
        "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
      }
    }
  });
  // Check that service workers are registered
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/zkit/service-worker.js');
    });
  }
})();
