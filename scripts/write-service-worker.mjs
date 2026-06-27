import { readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join, posix, relative, sep } from "node:path";

const distDir = new URL("../dist/", import.meta.url);
const distPath = fileURLToPath(distDir);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        return listFiles(fullPath);
      }

      return fullPath;
    })
  );

  return files.flat();
}

const files = await listFiles(distPath);
const precacheUrls = files
  .filter((file) => !file.endsWith(`${sep}service-worker.js`))
  .map((file) => {
    const relativePath = relative(distPath, file).split(sep).join(posix.sep);
    return `./${relativePath}`;
  })
  .sort();

const cacheId = createHash("sha256")
  .update(precacheUrls.join("|"))
  .digest("hex")
  .slice(0, 12);

const serviceWorker = `const CACHE_NAME = "math-cherry-practice-${cacheId}";
const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("math-cherry-practice-") && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => cached || fetch(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }

        return response;
      });
    })
  );
});
`;

await writeFile(new URL("../dist/service-worker.js", import.meta.url), serviceWorker);
