'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "d3593d394c62287390ef80875245b064",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/lib/src/assets/images/arrow.png": "b167f37ff33d740067bc3a6debde33fe",
"assets/lib/src/assets/images/contain_digit.png": "e56b1797f0476b5c35db421d838221cd",
"assets/lib/src/assets/images/decimal_to_binary.png": "3f70e28aa70c03bd287044893f70e78f",
"assets/lib/src/assets/images/doble_sum.png": "6a6795b9ad25775b3d8f340b40523a58",
"assets/lib/src/assets/images/equal_strings.png": "7d19056463c1a004214bac5e7a63d01f",
"assets/lib/src/assets/images/evaluate_polynomial.png": "08ab1c775523eda4d9874ccfea875d59",
"assets/lib/src/assets/images/factorial.png": "ce768c5d0223e91770df0718c44220bb",
"assets/lib/src/assets/images/favicon.png": "43cbf73b47a7b55809b94b59d47fbd4a",
"assets/lib/src/assets/images/fibonacci_n.png": "17f169196b1e0c77007948351af85b8e",
"assets/lib/src/assets/images/find_max.png": "6498a6199259669f47160aff86366b13",
"assets/lib/src/assets/images/is_palindrome.png": "09b2420b613e5668a35b9b830c3fa703",
"assets/lib/src/assets/images/is_prime.png": "fe34b65703a88ac9b3af619d28258dd2",
"assets/lib/src/assets/images/list_length.png": "51fe0ff75904d10128baad55068e9ea0",
"assets/lib/src/assets/images/list_sum.png": "09256c502fc4765f1436cdb159a7fc49",
"assets/lib/src/assets/images/mcd.png": "c4d4e8b2c8a3638e742f74025d11b1b3",
"assets/lib/src/assets/images/multi.png": "870e036837cd0aa26a5ebccd018bbda8",
"assets/lib/src/assets/images/natural_sum.png": "036e940ce32b73e788f3803db4a65ae9",
"assets/lib/src/assets/images/power.png": "253d6a1434f63855a29d6f0e00d35e08",
"assets/lib/src/assets/images/reverse_string.png": "d9f1aab4e138f6c80d27281f4fb1c083",
"assets/lib/src/assets/images/slow_addition.png": "bbd78f49563b2dbb6afb15b4b3e118b4",
"assets/lib/src/assets/images/small_arrow.png": "f9844e40f86ebda2b7b0093e84cf3621",
"assets/NOTICES": "83cc3600b36b85f92a1d3a6e0b1d7e0a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "cb1c619117d7758454b1c1f8fd7edfb6",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "8b2f8e4f4c85745f49153139423fd2f2",
"icons/Icon-512.png": "cb1c619117d7758454b1c1f8fd7edfb6",
"icons/Icon-maskable-192.png": "f17044d528a922b8085a274d37f18a75",
"icons/Icon-maskable-512.png": "afc697428cbed82c02167b9399c1fd36",
"index.html": "bd8bbb48821522a8594b479b5a0df7eb",
"/": "bd8bbb48821522a8594b479b5a0df7eb",
"lib/pocketpy.js": "415a8412e00d00f30672e50f293636c7",
"lib/pocketpy.wasm": "adda2e6e5971e835f366446114e3b93c",
"main.dart.js": "6d2c7b7aef48a6304c228eb7e22324b5",
"manifest.json": "c10447ff8e64293b437314b67571c805",
"version.json": "7c0d7a90d33a54c397447dece9203fd0"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
