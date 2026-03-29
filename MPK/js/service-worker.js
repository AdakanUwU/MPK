const CACHE_NAME = "mpk-full-cache-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1. pobierz sitemap
      const res = await fetch("/MPK/sitemap.xml");
      const text = await res.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");

      const pageUrls = [...xml.querySelectorAll("loc")]
        .map(el => el.textContent);

      const allAssets = new Set();

      // 2. dla każdej strony
      for (const url of pageUrls) {
        try {
          const pageRes = await fetch(url);
          const html = await pageRes.text();

          allAssets.add(url); // sama strona

          const doc = new DOMParser().parseFromString(html, "text/html");

          // CSS
          doc.querySelectorAll("link[href]").forEach(el => {
            allAssets.add(new URL(el.getAttribute("href"), url).href);
          });

          // JS
          doc.querySelectorAll("script[src]").forEach(el => {
            allAssets.add(new URL(el.getAttribute("src"), url).href);
          });

          // IMG
          doc.querySelectorAll("img[src]").forEach(el => {
            allAssets.add(new URL(el.getAttribute("src"), url).href);
          });

        } catch (err) {
          console.log("Błąd przy:", url);
        }
      }

      // 3. zapis wszystkiego do cache
      await cache.addAll([...allAssets]);
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// 4. obsługa offline
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => {
        return caches.match("/MPK/");
      });
    })
  );
});