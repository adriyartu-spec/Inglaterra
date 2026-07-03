// Service Worker – Aula Verde / Escuela Inglaterra
// Cache estático + notificaciones push para votaciones

const CACHE_NAME = "aula-verde-v1";
const STATIC_ASSETS = [
  "/",
  "/voto",
  "/admin/login",
];

// Install: cachear assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: limpiar caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback a cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("supabase.co")) return; // No cachear API
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Push: notificaciones de votación
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const options = {
    body: data.body ?? "Hay una votación activa en Aula Verde",
    icon: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png",
    vibrate: [200, 100, 200],
    data: { url: data.url ?? "/voto" },
    actions: [
      { action: "votar", title: "🗳️ Votar ahora" },
      { action: "cerrar", title: "Después" },
    ],
  };
  event.waitUntil(
    self.registration.showNotification(data.title ?? "🏫 Escuela Inglaterra", options)
  );
});

// Click en notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "votar" || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        const url = event.notification.data?.url ?? "/voto";
        for (const client of clientList) {
          if (client.url === url && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  }
});
