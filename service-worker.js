// CAVERNA — service worker: push + modo offline.
// Ao publicar uma versão nova do index.html, aumente o número em CACHE_VERSION.
const CACHE_VERSION = 'caverna-v3-2026-11-24';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './assets/body-female.webp',
  './assets/body-male.webp'
];
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // addAll falha tudo se um item falhar; por isso um a um, sem derrubar a instalação.
    await Promise.all(SHELL.map(url => cache.add(url).catch(() => {})));
    try { await cache.add(new Request(SUPABASE_JS, { mode: 'cors' })); } catch (_) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Biblioteca do Supabase (versão fixa): cache primeiro, para o app abrir offline.
  if (req.url === SUPABASE_JS) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      if (res && res.ok) (await caches.open(CACHE_VERSION)).put(req, res.clone());
      return res;
    })());
    return;
  }

  // Tudo que não for do próprio site (API do Supabase, etc.) segue direto para a rede.
  if (url.origin !== self.location.origin) return;

  // Páginas: rede primeiro (pega atualização), cache se estiver offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res && res.ok) (await caches.open(CACHE_VERSION)).put('./index.html', res.clone());
        return res;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Arquivos estáticos: usa o cache e atualiza em segundo plano.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    const network = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});

self.addEventListener('push', event => {
  let payload = { title: 'CAVERNA', body: 'Está na hora de cumprir seu compromisso.', url: './' };
  try { if (event.data) payload = { ...payload, ...event.data.json() }; } catch (_) {}
  event.waitUntil(self.registration.showNotification(payload.title || 'CAVERNA', {
    body: payload.body || 'Está na hora de cumprir seu compromisso.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: { url: payload.url || './' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.location.href).href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) { if ('focus' in client) { await client.focus(); client.navigate(target); return; } }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
