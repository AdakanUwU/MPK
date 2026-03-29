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

          allAssets.add(url);

          const doc = new DOMParser().parseFromString(html, "text/html");

          // normalne linki
          doc.querySelectorAll("a[href]").forEach(el => {
            allAssets.add(new URL(el.getAttribute("href"), url).href);
          });

          // data-href
          doc.querySelectorAll("[data-href]").forEach(el => {
            allAssets.add(new URL(el.getAttribute("data-href"), url).href);
          });

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

      try {
        const navUrl = "/MPK/nav.htm";

        const navRes = await fetch(navUrl);
        const navHtml = await navRes.text();

        allAssets.add(navUrl);

        const navDoc = new DOMParser().parseFromString(navHtml, "text/html");

        navDoc.querySelectorAll("a[href], [data-href]").forEach(el => {
          const link = el.getAttribute("href") || el.getAttribute("data-href");

          if (link) {
            allAssets.add(new URL(link, navUrl).href);
          }
        });

      } catch (err) {
        console.log("Błąd nav.htm");
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