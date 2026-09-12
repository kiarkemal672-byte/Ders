/* ═══════════════════════════════════════════════════════════════
   ቂራአት አስተዳደር — Service Worker
   استراتيجيات:
     • ملفات التطبيق   → كاش أولاً (تطبيق يعمل بدون إنترنت)
     • التنقل (فتح صفحة) → شبكة أولاً ثم الكاش
     • خطوط Google + CDN → Stale-While-Revalidate (أحدثها بالخلفية)
     • طلبات POST (المزامنة) → تمرّ مباشرة للشبكة ولا تُخزَّن
   ملاحظة التحديث: غيّر VERSION بالأسفل ليستبدل كل الأجهزة النسخة القديمة
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const VERSION       = 'v1.1.0';
const SHELL_CACHE   = 'qiraat-shell-'   + VERSION;
const RUNTIME_CACHE = 'qiraat-runtime-' + VERSION;
const FONT_CACHE    = 'qiraat-fonts-'   + VERSION;

const SHELL_FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=El+Messiri:wght@400;500;600;700&family=Noto+Serif+Ethiopic:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

/* ── التثبيت: تخزين الهيكل الأساسي ملفاً ملفاً (حتى لا يفشل الكل لو غاب ملف) ── */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await Promise.allSettled(SHELL_FILES.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res && res.ok) await cache.put(url, res);
      } catch (e) { /* مثلاً الأيقونات PNG قبل توليدها — نتجاهل بأمان */ }
    }));
    await self.skipWaiting();
  })());
});

/* ── التنشيط: تنظيف الكاشات القديمة والسيطرة على العملاء فوراً ── */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => ![SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE].includes(k))
          .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

/* ── رسائل من الصفحة (للتحديث الفوري عند توفر نسخة جديدة) ── */
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

/* ── اعتراض الطلبات ── */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;              // POST المزامنة يمر مباشرة

  const url = new URL(req.url);

  /* 1) فتح التطبيق (تنقّل): شبكة أولاً ← كاش ← index.html */
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(SHELL_CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        const cached = (await caches.match('./index.html'))
                    || (await caches.match(req, { ignoreSearch: true }));
        return cached || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  /* 2) ملفات الخطوط الفعلية (fonts.gstatic.com) — قديم فوري + تحديث خلفي */
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }

  /* 3) CDN: html2pdf + css الخطوط — قديم فوري + تحديث خلفي */
  if (url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  /* 4) ملفات التطبيق نفسه — كاش أولاً */
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (e) {
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
  }
});

/* Stale-While-Revalidate: أعدِ النسخة المخزنة فوراً وحدّثها في الخلفية */
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const refresh = fetch(req)
    .then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return cached || (await refresh) || new Response('Offline', { status: 503 });
}
