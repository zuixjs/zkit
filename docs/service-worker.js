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
    "revision": "27997d9cdce1acb7980bf5426d4e5df6"
  },
  {
    "url": "css/docs-view-pager.css",
    "revision": "762f9a763b1e2b61b8e0172b97d05c71"
  },
  {
    "url": "css/docs.css",
    "revision": "ffa290d2196a0f034822760266d7b091"
  },
  {
    "url": "css/flex-layout-attribute.min.css",
    "revision": "c55488315343d9afb4d13ebf9cc8f97b"
  },
  {
    "url": "docs/components/context_menu.html",
    "revision": "ad28009b1165c32941cfc89e8b37f88b"
  },
  {
    "url": "docs/components/hamburger_icon.css",
    "revision": "583a6f5565b6caf8d5266da0ae8c175a"
  },
  {
    "url": "docs/components/hamburger_icon.html",
    "revision": "6f063444f41dd44e97915f7ef1388b88"
  },
  {
    "url": "docs/components/media_browser.html",
    "revision": "9c1d2abd8cad432d5ad66c465d69370d"
  },
  {
    "url": "docs/components/menu_overlay.html",
    "revision": "fb0cfb447e9691a6bd7ecfeef82818f0"
  },
  {
    "url": "docs/controllers/drawer_layout.css",
    "revision": "147e310d796cf1a5006ba9288500905e"
  },
  {
    "url": "docs/controllers/drawer_layout.html",
    "revision": "f4169d89904dad4bcd127fcd4ad8e868"
  },
  {
    "url": "docs/controllers/drawer_layout.js",
    "revision": "a578d8f06f4fe61d4d8767b119702395"
  },
  {
    "url": "docs/controllers/gesture_helper.html",
    "revision": "495122954567898c69219077ea68d2be"
  },
  {
    "url": "docs/controllers/scroll_helper.css",
    "revision": "ad3e5363d07bcf42f28e20cf310f8f4e"
  },
  {
    "url": "docs/controllers/scroll_helper.html",
    "revision": "06ddf72f19e5f479d73e9626932bc95e"
  },
  {
    "url": "docs/controllers/scroll_helper.js",
    "revision": "20246fbbb37de4a4f331abd7b2794306"
  },
  {
    "url": "docs/controllers/view_pager.html",
    "revision": "57ce7fc7ea2dea2746e2fff70e9464b5"
  },
  {
    "url": "docs/templates/spin_kit.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "docs/templates/spin_kit.html",
    "revision": "e77711e7f30d59ff5ec6f18e1b2104b4"
  },
  {
    "url": "docs/templates/spin_kit.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "index.css",
    "revision": "e854253dbdcc75d63b74b6c760f2a265"
  },
  {
    "url": "index.html",
    "revision": "423f443883ba1ce4b57843ef4509860e"
  },
  {
    "url": "index.js",
    "revision": "35601184d3c4045f3bdc4256d132c2e3"
  },
  {
    "url": "js/zuix-bundler.js",
    "revision": "67966e8a0391d6aaaf82bf4457b4cb6d"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "5608ee77b079dd94db01ecd2f26afb10"
  },
  {
    "url": "js/zuix.js",
    "revision": "9754a5685a04cab4e889b33cd54577dd"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "d25fa195aff036fef82da66c37082100"
  },
  {
    "url": "lib/components/context_menu.css",
    "revision": "1ab97b7c8b80820314713f9fb0ec566b"
  },
  {
    "url": "lib/components/context_menu.html",
    "revision": "169086cf43d8fdd3882a2c764b4f65be"
  },
  {
    "url": "lib/components/context_menu.js",
    "revision": "496950ca72c1abc7e70322d5d18b61ef"
  },
  {
    "url": "lib/components/hamburger_icon.css",
    "revision": "dd81a60d1bfa7bd4463bb551eae81e35"
  },
  {
    "url": "lib/components/hamburger_icon.html",
    "revision": "14b9b9c25ea92bd9660a2e6ea53c1b0d"
  },
  {
    "url": "lib/components/hamburger_icon.js",
    "revision": "dea51abdfabfd08c5ac0b1bf4e337eb8"
  },
  {
    "url": "lib/components/media_browser.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/media_browser.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/media_browser.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/media_browser/article.css",
    "revision": "922f392e98cd6812dc59d1b007d96e16"
  },
  {
    "url": "lib/components/media_browser/article.html",
    "revision": "dc712c282458aa1ac6bed32ff2a31d8a"
  },
  {
    "url": "lib/components/media_browser/image.css",
    "revision": "cf5a4704af21281f5440307cd16c154f"
  },
  {
    "url": "lib/components/media_browser/image.html",
    "revision": "f14af3ebc29559117372c9af37a0f313"
  },
  {
    "url": "lib/components/media_browser/image.js",
    "revision": "2436897f418899f6566ffaba5f794f97"
  },
  {
    "url": "lib/components/media_browser/video.css",
    "revision": "02f6d109360ce0c2cbd108542282656d"
  },
  {
    "url": "lib/components/media_browser/video.html",
    "revision": "84bf58f509119a6b118bc541175ac346"
  },
  {
    "url": "lib/components/media_browser/video.js",
    "revision": "b541920f85e18da91d209c62374536b1"
  },
  {
    "url": "lib/components/menu_overlay.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/menu_overlay.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/menu_overlay.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/social_sharing.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/social_sharing.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/components/social_sharing.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "lib/controllers/drawer_layout.js",
    "revision": "6cd924a4108c126bfcbc1654b34c449b"
  },
  {
    "url": "lib/controllers/gesture_helper.js",
    "revision": "4229c04853fd9fa043c4915a960b4c76"
  },
  {
    "url": "lib/controllers/header_auto_hide.js",
    "revision": "c9d2b589da08a8f0de4266bae14a3ca9"
  },
  {
    "url": "lib/controllers/list_view.js",
    "revision": "535eba11165949fd636e144a9e6d3435"
  },
  {
    "url": "lib/controllers/scroll_helper.js",
    "revision": "68a8af206c909efc6da050de5cfd6ad8"
  },
  {
    "url": "lib/controllers/view_pager.js",
    "revision": "071de0f3520bd5ef66fc8157e4d8d3ab"
  },
  {
    "url": "lib/extensions/animate_css.js",
    "revision": "9958c9d78193bad8bb6f8956c66f4dd9"
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
    "url": "manifest.json",
    "revision": "cc675e0c8dac4d18f4d768ebc2fc5357"
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
    "url": "images/icons/android-chrome-192x192.png",
    "revision": "c65b3b163be074f54b235260b653ed99"
  },
  {
    "url": "images/icons/android-chrome-512x512.png",
    "revision": "05440a8503a635aef00d7a6501786ec1"
  },
  {
    "url": "images/icons/apple-touch-icon.png",
    "revision": "9b893ba884f0172ab34bfc213aa5543b"
  },
  {
    "url": "images/icons/favicon-16x16.png",
    "revision": "1a695a2fe6901c092aa7c26fe01769f8"
  },
  {
    "url": "images/icons/favicon-32x32.png",
    "revision": "c5da3e554f9a21da88023af198208916"
  },
  {
    "url": "images/icons/mstile-144x144.png",
    "revision": "86e19f9747f00ba328222b965121bbd6"
  },
  {
    "url": "images/icons/mstile-150x150.png",
    "revision": "298eedee4a8be4da5ca65e20d7f08339"
  },
  {
    "url": "images/icons/mstile-310x150.png",
    "revision": "dbd2bff7b320fa00a834a71c419787a8"
  },
  {
    "url": "images/icons/mstile-310x310.png",
    "revision": "27370a5ca46851eddd974ccd7543ab6f"
  },
  {
    "url": "images/icons/mstile-70x70.png",
    "revision": "8c35bf6732e9888e974ea045dcc26c9a"
  },
  {
    "url": "images/icons/safari-pinned-tab.svg",
    "revision": "1cd53a71ad5a209b60149caec1fa4784"
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
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/parallax/layer07_Sky.png",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "images/profile-icon.png",
    "revision": "56f0c7de57fdae6d0a9ddc43448b6dff"
  },
  {
    "url": "images/zkit-logo.svg",
    "revision": "82c73da40d4714945d0ebaba36c9eb48"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg)$/, workbox.strategies.cacheFirst({ cacheName: "images", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/\.(?:html|json|js|css)$/, workbox.strategies.cacheFirst({ cacheName: "default", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
