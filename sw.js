const CACHE_NAME = "football-europe-live-v1";

const STATIC_ASSETS = [
    "./index.html",
    "./css/styles.css",
    "./js/config.js",
    "./js/api.js",
    "./js/components.js",
    "./js/app.js",
    "./js/ui.js",
    "./manifest.json",
    "./img/favicon/favicon.svg",
    "./img/favicon/icon-192.png",
    "./img/favicon/icon-512.png"
];

/*=========================================
        INSTALACIÓN: cachear estáticos
=========================================*/

self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );

    self.skipWaiting();

});

/*=========================================
        ACTIVACIÓN: limpiar caches viejos
=========================================*/

self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );

    self.clients.claim();

});

/*=========================================
        FETCH: estrategia según tipo
=========================================*/

self.addEventListener("fetch", (event) => {

    const url = new URL(event.request.url);

    const isApiCall = url.origin.includes("cdviloria25.workers.dev");

    // Datos en vivo (API): siempre red, sin cache
    if (isApiCall) {

        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(
                    JSON.stringify({ error: "Sin conexión" }),
                    { headers: { "Content-Type": "application/json" } }
                );
            })
        );

        return;

    }

    // Assets estáticos: cache primero, red como respaldo
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {

                if (
                    !response ||
                    response.status !== 200 ||
                    response.type !== "basic"
                ) {
                    return response;
                }

                const responseClone = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });

                return response;

            });

        })
    );

});
