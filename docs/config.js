/* eslint-disable quotes */
(function() {
  zuix.store('config', {
    "title": "<code>zKit</code> components",
    "subtitle": "web enhancing bits",
    "googleSiteId": "UA-116384214-1",
    "baseUrl": "/zkit/",
    "resourcePath": "/zkit/app/",
    "libraryPath": {
      "@lib": "/zkit/lib/1.2/",
      "@hgui": "https://genielabs.github.io/homegenie-web-ui/app/",
      "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
    },
    "zuixjs.github.io": {
      "resourcePath": "/zkit/app/",
      "libraryPath": {
        "@lib": "/zkit/lib/1.2/",
        "@hgui": "https://genielabs.github.io/homegenie-web-ui/app/",
        "@cdnjs": "https://cdnjs.cloudflare.com/ajax/libs/"
      }
    },
    "zkit": {
      "libraryPath": "https://zuixjs.github.io/zkit/lib/1.2/",
      "zuixVersion": "1.1.22"
    },
    "siteMapUrl": "https://zuixjs.github.io/zkit"
  });
  // Check that service workers are registered
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/zkit/service-worker.js');
    });
  }
})();
