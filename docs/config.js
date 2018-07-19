/* eslint-disable quotes */
(function() {
    zuix.store("config", {
        "title": "zKit, components for modern web.",
        "googleSiteId": "UA-123-456",
        "resourcePath": "",
        "libraryPath": "/lib/",
        "genielabs.github.io": {
                "resourcePath": "/zkit/",
                "libraryPath": "/lib/"
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
