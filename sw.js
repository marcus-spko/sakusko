// SakuSKO service worker — menyimpan semua file aplikasi di HP supaya bisa dipakai tanpa sinyal.
// Naikkan VERSION setiap ada pembaruan supaya HP mengunduh versi baru.
const VERSION = 'sakusko-v0.1.23';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/formulas.js',
  './js/i18n.js',
  './js/session.js',
  './js/tests.js',
  './js/tests2.js',
  './js/tests3.js',
  './js/tkpn-norm.js',
  './js/who2007.js',
  './js/tomkinson.js',
  './js/titlecase.js',
  './js/screening.js',
  './js/m48.js',
  './js/m510.js',
  './js/nypr.js',
  './js/m79.js',
  './js/darurat.js',
  './js/parq.js',
  './docs/PARQplus-2025-English.pdf',
  './docs/PARQplus-2020-Indonesia-Supplement1.pdf',
  './fonts/plus-jakarta-sans-latin-400-normal.woff2',
  './fonts/plus-jakarta-sans-latin-600-normal.woff2',
  './fonts/plus-jakarta-sans-latin-700-normal.woff2',
  './fonts/plus-jakarta-sans-latin-800-normal.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('sakusko-') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    })
  );
});
