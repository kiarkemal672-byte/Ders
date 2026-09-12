'use strict';

const VERSION       = 'v1.2.0';
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
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=El+Messiri:wght@400;500;600;700&family=Noto+Serif+Ethiopic:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

/* ── التثبيت ── */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);

    /* تخزين الملفات الموجودة */
    await Promise.allSettled(SHELL_FILES.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res && res.ok) await cache.put(url, res);
      } catch (e) { /* تجاهل */ }
    }));

    /* ═══ ✅ توليد أيقونات PNG تلقائياً (لا تحتاج ملفات!) ═══ */
    for (const size of [192, 512]) {
      try {
        const iconRes = await generateIconResponse(size);
        await cache.put(`./icons/icon-${size}.png`, iconRes.clone());
        const iconRes2 = await generateIconResponse(size);
        await cache.put(`/icons/icon-${size}.png`, iconRes2);
      } catch (e) { console.warn('icon gen:', e); }
    }

    await self.skipWaiting();
  })());
});

/* ── التنشيط ── */
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

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

/* ── اعتراض الطلبات ── */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* ═══ ✅ تقديم الأيقونات المولّدة تلقائياً ═══ */
  const iconMatch = url.pathname.match(/\/icons\/icon-(\d+)\.png$/);
  if (iconMatch) {
    event.respondWith((async () => {
      const cached = await caches.match(req) || await caches.match(url.pathname);
      if (cached) return cached;
      const size = parseInt(iconMatch[1]);
      try { return await generateIconResponse(size); }
      catch (e) { return new Response('', { status: 404 }); }
    })());
    return;
  }

  /* 1) التنقل */
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(SHELL_CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match('./index.html'))
            || (await caches.match(req, { ignoreSearch: true }))
            || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  /* 2) الخطوط الفعلية */
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }

  /* 3) CDN */
  if (url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  /* 4) ملفات التطبيق */
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
        return new Response('Offline', { status: 503 });
      }
    })());
  }
});

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const refresh = fetch(req)
    .then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return cached || (await refresh) || new Response('Offline', { status: 503 });
}

/* ═════════════════════════════════════════════════
   ✅ مولّد الأيقونات — يرسم كتاباً ذهبياً على خلفية داكنة
   ═════════════════════════════════════════════════ */
async function generateIconResponse(size) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size;

  /* الخلفية */
  const bgGrad = ctx.createLinearGradient(0, 0, s, s);
  bgGrad.addColorStop(0, '#0a1120');
  bgGrad.addColorStop(1, '#14224a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, s, s);

  /* هالة خفيفة */
  ctx.strokeStyle = 'rgba(47, 227, 199, 0.15)';
  ctx.lineWidth = s * 0.025;
  ctx.beginPath();
  ctx.arc(s / 2, s * 0.48, s * 0.33, 0, Math.PI * 2);
  ctx.stroke();

  /* الكتاب الذهبي */
  const goldGrad = ctx.createLinearGradient(0, s * 0.25, 0, s * 0.75);
  goldGrad.addColorStop(0, '#f9dd8a');
  goldGrad.addColorStop(1, '#d99e20');
  ctx.fillStyle = goldGrad;

  const cx = s / 2;
  const bw = s * 0.58;
  const bh = s * 0.38;
  const bx = cx - bw / 2;
  const by = s * 0.30;

  ctx.beginPath();
  ctx.moveTo(cx, by + s * 0.04);
  ctx.bezierCurveTo(cx - bw * 0.25, by, bx, by - s * 0.005, bx, by + s * 0.035);
  ctx.lineTo(bx, by + bh - s * 0.035);
  ctx.bezierCurveTo(bx + bw * 0.18, by + bh - s * 0.07, cx - bw * 0.18, by + bh - s * 0.05, cx, by + bh);
  ctx.bezierCurveTo(cx + bw * 0.18, by + bh - s * 0.05, bx + bw, by + bh - s * 0.07, bx + bw, by + bh - s * 0.035);
  ctx.lineTo(bx + bw, by + s * 0.035);
  ctx.bezierCurveTo(bx + bw, by - s * 0.005, cx + bw * 0.25, by, cx, by + s * 0.04);
  ctx.closePath();
  ctx.fill();

  /* تجليد الكتاب */
  ctx.strokeStyle = '#5c3d0e';
  ctx.lineWidth = Math.max(2, s * 0.015);
  ctx.beginPath();
  ctx.moveTo(cx, by + s * 0.04);
  ctx.lineTo(cx, by + bh);
  ctx.stroke();

  /* أسطر الصفحات */
  ctx.strokeStyle = 'rgba(92, 61, 14, 0.55)';
  ctx.lineWidth = Math.max(1, s * 0.008);
  ctx.lineCap = 'round';
  const lineY0 = by + s * 0.09;
  const lineGap = s * 0.07;

  for (let i = 0; i < 3; i++) {
    const y = lineY0 + i * lineGap;
    /* يسار */
    ctx.beginPath();
    ctx.moveTo(bx + s * 0.06, y);
    ctx.quadraticCurveTo((bx + cx) / 2, y - s * 0.008, cx - s * 0.035, y);
    ctx.stroke();
    /* يمين */
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.035, y);
    ctx.quadraticCurveTo((cx + bx + bw) / 2, y - s * 0.008, bx + bw - s * 0.06, y);
    ctx.stroke();
  }

  /* نجمة علوية */
  ctx.fillStyle = '#f2c14e';
  const sy = s * 0.14;
  const sr = s * 0.035;
  ctx.beginPath();
  ctx.moveTo(cx, sy - sr);
  ctx.lineTo(cx + sr * 0.35, sy - sr * 0.35);
  ctx.lineTo(cx + sr, sy);
  ctx.lineTo(cx + sr * 0.35, sy + sr * 0.35);
  ctx.lineTo(cx, sy + sr);
  ctx.lineTo(cx - sr * 0.35, sy + sr * 0.35);
  ctx.lineTo(cx - sr, sy);
  ctx.lineTo(cx - sr * 0.35, sy - sr * 0.35);
  ctx.closePath();
  ctx.fill();

  /* خط سفلي زخرفي */
  ctx.fillStyle = 'rgba(47, 227, 199, 0.4)';
  ctx.fillRect(s * 0.33, s * 0.84, s * 0.34, Math.max(2, s * 0.012));

  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return new Response(blob, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
}
