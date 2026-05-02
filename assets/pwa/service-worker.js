self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("app").then(cache => cache.addAll([
      "/",
      "/index.html",
      "/dashboard.html"
    ]))
  );
});
