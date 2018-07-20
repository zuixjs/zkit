/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "config.js",
    "revision": "63b736757c12a9324b14a6224fc8782c"
  },
  {
    "url": "css/docs-view-pager.css",
    "revision": "762f9a763b1e2b61b8e0172b97d05c71"
  },
  {
    "url": "css/docs.css",
    "revision": "a3c2ac97b1c4ec91081dce50a6ab72cc"
  },
  {
    "url": "css/flex-layout-attribute.min.css",
    "revision": "c55488315343d9afb4d13ebf9cc8f97b"
  },
  {
    "url": "docs/components/media_browser.html",
    "revision": "5d6155bdc920701625c5b55034bcc8f3"
  },
  {
    "url": "docs/components/menu_overlay.html",
    "revision": "890ee94e3811fcb4e505271ea1c1b4e8"
  },
  {
    "url": "docs/controllers/drawer_layout.css",
    "revision": "147e310d796cf1a5006ba9288500905e"
  },
  {
    "url": "docs/controllers/drawer_layout.html",
    "revision": "60c7c0305df56373c4dfe39aa3925d42"
  },
  {
    "url": "docs/controllers/drawer_layout.js",
    "revision": "a578d8f06f4fe61d4d8767b119702395"
  },
  {
    "url": "docs/controllers/gesture_helper.html",
    "revision": "2f4bbe3ae7281a6ee7296129c8ec7767"
  },
  {
    "url": "docs/controllers/scroll_helper.css",
    "revision": "ad3e5363d07bcf42f28e20cf310f8f4e"
  },
  {
    "url": "docs/controllers/scroll_helper.html",
    "revision": "4f906da1e07c9c9a2bba9ef18e432f9b"
  },
  {
    "url": "docs/controllers/scroll_helper.js",
    "revision": "20246fbbb37de4a4f331abd7b2794306"
  },
  {
    "url": "docs/controllers/view_pager.html",
    "revision": "6d261dded5e16024e49e343f8ff37abc"
  },
  {
    "url": "index.css",
    "revision": "d3cb522dfcaa034c131977bb91b148b5"
  },
  {
    "url": "index.html",
    "revision": "c4ae7401f1007f8e164186827160d71c"
  },
  {
    "url": "index.js",
    "revision": "f5e8e8ba58c8ade7e63729360589902e"
  },
  {
    "url": "js/zuix-bundler.js",
    "revision": "cd4d2491f787cab75e871ce3c7c2a1fd"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "f0869de8aea2e54e9dea19fc6bf15edd"
  },
  {
    "url": "js/zuix.js",
    "revision": "212883fdac0b3dc43377c546db1806c5"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "c41a4bbdc3dc4c0fdb4df45988b1990f"
  },
  {
    "url": "lib/components/hamburger_icon.css",
    "revision": "9cc71a87e4fee0d1e5625664dabae125"
  },
  {
    "url": "lib/components/hamburger_icon.html",
    "revision": "1fba4a8c858b8cae60fbe8e8f269657c"
  },
  {
    "url": "lib/components/hamburger_icon.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/media_browser.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/media_browser.html",
    "revision": "27b42f4a8cecbb5da1fe28034bc7ec47"
  },
  {
    "url": "lib/components/media_browser.js",
    "revision": "88f15ecbcbb83c9b1d6c49b2b2cfc899"
  },
  {
    "url": "lib/components/menu_overlay.css",
    "revision": "da22f627f1ad0eac48a8309dc7e81c57"
  },
  {
    "url": "lib/components/menu_overlay.html",
    "revision": "e6951bef43b9af00e484f7cc506a3323"
  },
  {
    "url": "lib/components/menu_overlay.js",
    "revision": "506d71122dfc55d9d6306c7bcfd772b6"
  },
  {
    "url": "lib/components/social_sharing.css",
    "revision": "0b0a47fa081f1c12f590a9faaa2a8449"
  },
  {
    "url": "lib/components/social_sharing.html",
    "revision": "c430e8b7c7de35a8e1745c7fef67e781"
  },
  {
    "url": "lib/components/social_sharing.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/controllers/drawer_layout.js",
    "revision": "5b75da73c82d635756894dd17467b730"
  },
  {
    "url": "lib/controllers/gesture_helper.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/controllers/list_view.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/controllers/scroll_helper.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/controllers/view_pager.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/extensions/animate_css.js",
    "revision": "9958c9d78193bad8bb6f8956c66f4dd9"
  },
  {
    "url": "lib/templates/spinkit/circle.css",
    "revision": "e605150d128455248875cf8b704e4cd7"
  },
  {
    "url": "lib/templates/spinkit/circle.html",
    "revision": "286f7cfd97f5260c25b035a756da4e78"
  },
  {
    "url": "lib/templates/spinkit/cube_grid.css",
    "revision": "83427891b4e22468af0c577e87907349"
  },
  {
    "url": "lib/templates/spinkit/cube_grid.html",
    "revision": "cc51572a5290f77a59cdd0c6ccd65cb4"
  },
  {
    "url": "lib/templates/spinkit/fading_circle.css",
    "revision": "124ee683f2a29ec4cd040bbd74c96746"
  },
  {
    "url": "lib/templates/spinkit/fading_circle.html",
    "revision": "3f231b39520b1138b1a1ad80d88f49a9"
  },
  {
    "url": "lib/templates/spinkit/folding_cube.css",
    "revision": "22353c2d6e4a7998baaad1d824041652"
  },
  {
    "url": "lib/templates/spinkit/folding_cube.html",
    "revision": "e420d0814ba3544a2473afdbfddc45c2"
  },
  {
    "url": "lib/templates/spinkit/rects.css",
    "revision": "78e86abb396a6c786a3f062cc94ddfb1"
  },
  {
    "url": "lib/templates/spinkit/rects.html",
    "revision": "a41d42cb5e95f483c3ce52a0ec9f30c4"
  },
  {
    "url": "lib/templates/spinkit/spinner_cubes.css",
    "revision": "700643a3b4ced17608d3bb6262497bc1"
  },
  {
    "url": "lib/templates/spinkit/spinner_cubes.html",
    "revision": "43a591eff4a997f36516c94240a9a883"
  },
  {
    "url": "lib/templates/spinkit/spinner_grow.css",
    "revision": "f61806734b7c8fb0c437312b63882133"
  },
  {
    "url": "lib/templates/spinkit/spinner_grow.html",
    "revision": "687844e0d4466832710422cad2b2b378"
  },
  {
    "url": "lib/templates/spinkit/spinner.css",
    "revision": "848ac13177b296af3720901c40160992"
  },
  {
    "url": "lib/templates/spinkit/spinner.html",
    "revision": "b283c2089f5f4d96f36c92a2997b1fe8"
  },
  {
    "url": "lib/widgets/timeclock.css",
    "revision": "d6acbfd22af28ce13562b8693c9d13b9"
  },
  {
    "url": "lib/widgets/timeclock.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/widgets/timeclock.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/capguy-walk.png",
    "revision": "e70e7d41a4a2af947f551aa49b1236d2"
  },
  {
    "url": "images/github-octocat.svg",
    "revision": "5903a1df2f4b6dc96e4db491de5fbea7"
  },
  {
    "url": "images/parallax/layer01_Ground.png",
    "revision": "a56113d75d34e13a3e62d1ec86390fbb"
  },
  {
    "url": "images/parallax/layer02_Trees_rocks.png",
    "revision": "a582a3cab2cf46f701967e18eeda7f4e"
  },
  {
    "url": "images/parallax/layer03_Hills_Castle.png",
    "revision": "949c06b5ed426ef0c24f415057fac4dc"
  },
  {
    "url": "images/parallax/layer04_Clouds.png",
    "revision": "cf317535775c65a0ade09ddbdc724434"
  },
  {
    "url": "images/parallax/layer05_Hills.png",
    "revision": "c0a27bdedd23577f0184b3346c8c7ff5"
  },
  {
    "url": "images/parallax/layer06_Rocks.png",
    "revision": "ab380e350e6def2b0203a692d0cbba5d"
  },
  {
    "url": "images/parallax/layer07_Sky.png",
    "revision": "f63414c53a8a7db37709f031d5b67b5f"
  },
  {
    "url": "images/profile-icon.png",
    "revision": "56f0c7de57fdae6d0a9ddc43448b6dff"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg)$/, workbox.strategies.cacheFirst({ cacheName: "images", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/\.(?:html|json|js|css)$/, workbox.strategies.cacheFirst({ cacheName: "default", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
