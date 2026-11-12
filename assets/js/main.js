/* =========================================================
   VIRELI — interactions & motion
   Vanilla JS, no dependencies.
   ========================================================= */

/* ---------- Store configuration ----------
   Set variantId once the Vireli Shopify store is connected
   (Shopify Admin → Products → Night Gummies → variant ID).
   With a variantId, "Zur Kasse" opens Shopify checkout directly
   with the chosen quantity. Without it, it opens the product page. */
const CONFIG = {
  shopDomain: 'vireli-rjmhlijj.myshopify.com',
  productHandle: 'vireli-night-gummies-mixed-berry',
  variantId: null,
  title: 'Vireli Night Gummies – Mixed Berry',
  variantLabel: '60 Gummies · 60 Portionen',
  price: 34.90,
  currency: 'CHF',
  available: true,
  freeShippingThreshold: 60,
  image: 'assets/img/product-scene.webp',
};

(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isDesktop = () => matchMedia('(min-width: 900px)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  const chf = n => `CHF ${n.toFixed(2)}`;

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  /* ---------- Load-in ---------- */
  requestAnimationFrame(() => document.documentElement.classList.add('is-loaded'));
  document.body.classList.add('is-loaded');

  /* ---------- Header state ---------- */
  const header = $('[data-header]');
  const lightSections = $$('.ingredients, .product, .story');
  function updateHeader() {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 40);
    const probe = (header.getBoundingClientRect().bottom || 72) - 4;
    const onLight = lightSections.some(sec => {
      const r = sec.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    header.classList.toggle('is-light', onLight);
  }

  /* ---------- Menu ---------- */
  const menu = $('[data-menu]');
  const menuBtn = $('[data-menu-open]');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) $('[data-menu-close]').focus();
  }
  menuBtn.addEventListener('click', () => setMenu(true));
  $('[data-menu-close]').addEventListener('click', () => setMenu(false));
  $$('[data-menu-link]').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Generated video layers (lazy, only when visible) ---------- */
  const videos = $$('video[data-video]');
  if (!reduced && !saveData && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver(entries => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.dataset.loaded) {
            const src = v.dataset.src || (isDesktop() ? v.dataset.srcDesktop : v.dataset.srcMobile);
            if (!src) return;
            v.src = src;
            v.dataset.loaded = '1';
            v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
          }
          v.play().catch(() => {});
        } else if (v.dataset.loaded) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    videos.forEach(v => vio.observe(v));
  }

  /* ---------- Particles ---------- */
  function particles(canvas, opts) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts = [], running = false, raf;
    const count = opts.count;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        r: Math.random() * opts.size + .4,
        vy: -(Math.random() * .25 + .05),
        vx: (Math.random() - .5) * .12,
        a: Math.random() * .6 + .2,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < .75 ? opts.colors[0] : opts.colors[1],
      };
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.tw += .02;
        if (p.y < -10) Object.assign(p, spawn(false));
        const alpha = p.a * (.55 + .45 * Math.sin(p.tw));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${p.hue},${alpha})`);
        g.addColorStop(1, `rgba(${p.hue},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      if (running) raf = requestAnimationFrame(tick);
    }
    resize();
    parts = Array.from({ length: count }, () => spawn(true));
    addEventListener('resize', resize, { passive: true });
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !reduced;
      cancelAnimationFrame(raf);
      if (running) tick(); else if (reduced) tick();
    }).observe(canvas);
  }
  $$('canvas[data-particles]').forEach(c => particles(c, {
    count: innerWidth < 700 ? 40 : 80,
    size: 1.6,
    colors: ['214,196,240', '255,236,214'],
  }));

  /* ---------- Floating berries & gummies ---------- */
  const FLOAT = 'assets/img/float/';
  const heroFloat = [
    { f: 'raspberry', x: '-3%', y: '88%', s: 'clamp(70px,11vw,170px)', b: 6, depth: 40 },
    { f: 'gummy-34', x: '50%', y: '86%', s: 'clamp(54px,7vw,110px)', b: 0, depth: 26 },
    { f: 'blackberry', x: '86%', y: '8%', s: 'clamp(48px,6vw,96px)', b: 3, depth: 18 },
    { f: 'gummy-tilt', x: '90%', y: '74%', s: 'clamp(60px,8vw,130px)', b: 2, depth: 30 },
    { f: 'blueberry', x: '30%', y: '12%', s: 'clamp(30px,3.6vw,58px)', b: 4, depth: 12 },
  ];
  const finalFloat = [
    { f: 'gummy-top', x: '-12%', y: '14%', s: 'clamp(60px,9vw,120px)', b: 0, depth: 22 },
    { f: 'strawberry', x: '88%', y: '6%', s: 'clamp(56px,8vw,110px)', b: 2, depth: 30 },
    { f: 'gummy-side', x: '90%', y: '78%', s: 'clamp(60px,9vw,120px)', b: 0, depth: 26 },
    { f: 'blackberry', x: '-8%', y: '80%', s: 'clamp(44px,6vw,86px)', b: 3, depth: 16 },
  ];
  function buildFloaters(el, list) {
    list.forEach((it, i) => {
      const d = document.createElement('div');
      d.className = 'floater';
      d.style.cssText = `--x:${it.x};--y:${it.y};--s:${it.s};--b:${it.b}px;--d:${7 + (i % 3) * 2.2}s;--delay:${-i * 1.7}s;--r0:${-10 + i * 4}deg;--r1:${8 - i * 3}deg;--fx:${(i % 2 ? -1 : 1) * 12}px;--fy:${-18 - i * 3}px`;
      d.dataset.depth = it.depth;
      const img = new Image();
      img.src = FLOAT + it.f + '.webp'; img.alt = ''; img.decoding = 'async'; img.loading = 'lazy';
      d.appendChild(img);
      el.appendChild(d);
    });
  }
  const floaterEls = $$('[data-floaters]');
  if (floaterEls[0]) buildFloaters(floaterEls[0], innerWidth < 700 ? heroFloat.filter(f => f.depth < 20) : heroFloat);
  if (floaterEls[1]) buildFloaters(floaterEls[1], finalFloat);

  let heroCamScale = 1;

  /* pointer parallax for floaters + subtle 3D tilt of hero scene */
  if (finePointer && !reduced) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => {
      tx = e.clientX / innerWidth - .5;
      ty = e.clientY / innerHeight - .5;
    }, { passive: true });
    (function loop() {
      cx = lerp(cx, tx, .06); cy = lerp(cy, ty, .06);
      $$('.floater').forEach(f => {
        const d = +f.dataset.depth || 20;
        f.firstChild.style.setProperty('--px', `${-cx * d}px`);
        f.firstChild.style.setProperty('--py', `${-cy * d}px`);
      });
      const cam = $('.hero-camera');
      if (cam) cam.style.transform = `rotateY(${cx * 3}deg) rotateX(${-cy * 2}deg) scale(${heroCamScale})`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Hero scroll: camera moves toward product ---------- */
  const hero = $('[data-hero]');
  const heroContent = $('[data-hero-content]');
  function heroScroll() {
    const h = hero.offsetHeight;
    const p = clamp(scrollY / h);
    heroCamScale = 1 + ease(p) * .18;
    if (!finePointer || reduced) $('.hero-camera').style.transform = `scale(${heroCamScale})`;
    heroContent.style.transform = `translate3d(0, ${p * -80}px, 0)`;
    heroContent.style.opacity = String(1 - range(p, .1, .6));
  }

  /* ---------- Product reveal (sticky scroll scene) ---------- */
  const revealSec = $('[data-reveal-section]');
  const rFrame = $('[data-reveal-frame]');
  const rPouch = $('[data-reveal-pouch]');
  const rCopy = $('[data-reveal-copy]');
  const rGum = $('[data-reveal-gummies]');
  const gumSet = ['gummy-top', 'gummy-34', 'gummy-tilt', 'gummy-side', 'gummy-34', 'gummy-top', 'gummy-tilt', 'raspberry', 'blackberry', 'gummy-side'];
  const gumPos = [
    [-38, -30, 90, 0], [36, -34, 110, 2], [-44, 18, 120, 0], [42, 22, 80, 1], [-18, -42, 60, 4],
    [20, 40, 70, 3], [-28, 40, 96, 1], [46, -6, 64, 2], [-48, -6, 58, 3], [10, -46, 54, 5],
  ];
  gumSet.forEach((f, i) => {
    const [x, y, s, b] = gumPos[i];
    const d = document.createElement('div');
    d.className = 'rg';
    d.style.cssText = `--tx:${x}vw;--ty:${y}svh;--s:clamp(${s * .55}px, ${s / 12}vw, ${s * 1.3}px);--b:${b}px;--rot:${(i % 2 ? -1 : 1) * (40 + i * 12)}deg;--d:${6 + i % 4}s`;
    const img = new Image(); img.src = FLOAT + f + '.webp'; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    d.appendChild(img); rGum.appendChild(d);
  });
  const rgEls = $$('.rg', rGum);

  function revealScroll() {
    const r = revealSec.getBoundingClientRect();
    const total = revealSec.offsetHeight - innerHeight;
    const p = clamp(-r.top / total);
    revealSec.style.setProperty('--p', p.toFixed(4));
    if (reduced) return;

    // pouch: moves to centre, zooms toward camera, then dissolves into light
    const a = ease(range(p, 0, .45));
    const b = ease(range(p, .38, .62));
    rPouch.style.setProperty('--pouch-s', (lerp(.62, 1.05, a) + b * .9).toFixed(4));
    rPouch.style.setProperty('--pouch-y', `${lerp(18, 0, a) - b * 40}px`);
    rPouch.style.setProperty('--pouch-r', `${lerp(-14, 0, a)}deg`);
    rPouch.style.setProperty('--pouch-o', (1 - range(p, .5, .64)).toFixed(3));
    rPouch.style.setProperty('--flare', (Math.sin(range(p, .36, .66) * Math.PI) * 1.2).toFixed(3));

    // macro gummy backdrop opens from a window into full-bleed
    const f = ease(range(p, .42, .8));
    rFrame.style.setProperty('--ci-y', `${lerp(50, 0, f)}%`);
    rFrame.style.setProperty('--ci-x', `${lerp(50, 0, f)}%`);
    rFrame.style.setProperty('--ci-r', `${lerp(200, 0, f)}px`);
    rFrame.style.setProperty('--img-s', lerp(1.35, 1.04, f).toFixed(4));
    rFrame.querySelector('.reveal-shade').style.opacity = String(range(p, .66, .86) * .95);

    // gummies burst out of the pouch in slow motion
    const g = ease(range(p, .34, .72));
    rgEls.forEach((el, i) => el.style.setProperty('--g', clamp(g * 1.15 - i * .025).toFixed(4)));

    // copy
    rCopy.style.setProperty('--copy', ease(range(p, .74, .9)).toFixed(4));
  }

  /* ---------- Lifestyle parallax ---------- */
  const para = $('[data-parallax]');
  const paraSec = $('[data-parallax-section]');
  function parallax() {
    if (reduced) return;
    const r = paraSec.getBoundingClientRect();
    const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
    para.style.transform = `translate3d(0, ${(p - .5) * -12}%, 0) scale(1.06)`;
  }

  /* ---------- Story: words light up while scrolling ---------- */
  const storyText = $('[data-words]');
  storyText.innerHTML = storyText.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const storyWords = $$('.w', storyText);
  function storyScroll() {
    const r = storyText.getBoundingClientRect();
    const p = clamp((innerHeight * .85 - r.top) / (r.height + innerHeight * .35));
    const n = Math.round(p * storyWords.length);
    storyWords.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  /* ---------- Scroll loop ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      heroScroll();
      revealScroll();
      parallax();
      storyScroll();
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Split text & reveal-on-view ---------- */
  $$('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'word';
            const inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal-up:not(.hero .reveal-up), [data-split], [data-ing]').forEach(el => io.observe(el));

  /* ---------- Ingredient cards: tap to open, tilt on hover ---------- */
  $$('[data-ing]').forEach(card => {
    const toggle = () => card.classList.toggle('is-open');
    card.addEventListener('click', () => { if (!finePointer) toggle(); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    if (finePointer && !reduced) {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 8}deg`);
        card.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * 8}deg`);
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    }
  });

  /* ---------- Product stage: tilt + glare + gallery ---------- */
  const stage = $('[data-tilt]');
  const stageInner = $('.stage-inner', stage);
  const glare = $('.glare', stage);
  if (!reduced) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      stageInner.style.setProperty('--ry', `${(x - .5) * 14}deg`);
      stageInner.style.setProperty('--rx', `${-(y - .5) * 10}deg`);
      glare.style.setProperty('--gx', `${x * 100}%`);
      glare.style.setProperty('--gy', `${y * 100}%`);
      glare.style.setProperty('--go', 1);
      stage.classList.add('touched');
    });
    stage.addEventListener('pointerleave', () => {
      stageInner.style.setProperty('--rx', '0deg'); stageInner.style.setProperty('--ry', '0deg');
      glare.style.setProperty('--go', 0);
    });
  }
  const stageImg = $('[data-stage-img]');
  $$('.thumb').forEach(t => t.addEventListener('click', () => {
    if (t.classList.contains('is-active')) return;
    $$('.thumb').forEach(x => x.classList.toggle('is-active', x === t));
    stageImg.classList.add('is-swapping');
    setTimeout(() => {
      stageImg.src = t.dataset.src; stageImg.alt = t.dataset.alt;
      stageImg.onload = () => stageImg.classList.remove('is-swapping');
    }, 280);
  }));

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        btn.style.setProperty('--mx', `${x}px`); btn.style.setProperty('--my', `${y}px`);
        btn.style.transform = `translate(${(x - r.width / 2) * .18}px, ${(y - r.height / 2) * .28}px)`;
        btn.firstElementChild.style.transform = `translate(${(x - r.width / 2) * .08}px, ${(y - r.height / 2) * .1}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; btn.firstElementChild.style.transform = ''; });
    });
  }

  /* ---------- Availability ---------- */
  const addBtn = $('[data-add-to-cart]');
  if (!CONFIG.available) {
    $('[data-stock]').classList.add('is-out');
    $('[data-stock-text]').textContent = 'Derzeit ausverkauft';
    addBtn.disabled = true;
    addBtn.firstElementChild.textContent = 'Ausverkauft';
  }

  /* ---------- Quantity ---------- */
  const qtyInput = $('[data-qty-input]');
  $$('[data-qty]').forEach(b => b.addEventListener('click', () => {
    qtyInput.value = clamp((+qtyInput.value || 1) + +b.dataset.qty, 1, 10);
  }));
  qtyInput.addEventListener('change', () => { qtyInput.value = clamp(Math.round(+qtyInput.value) || 1, 1, 10); });

  /* ---------- Cart ---------- */
  let qty = store.get('vireli-cart-qty', 0);
  const cart = $('[data-cart]');
  const scrim = $('[data-scrim]');
  const countEl = $('[data-cart-count]');
  const body = $('[data-cart-body]');
  let lastFocus = null;

  function checkoutUrl() {
    if (CONFIG.variantId) return `https://${CONFIG.shopDomain}/cart/${CONFIG.variantId}:${qty}`;
    return `https://${CONFIG.shopDomain}/products/${CONFIG.productHandle}`;
  }
  function render() {
    store.set('vireli-cart-qty', qty);
    countEl.textContent = qty;
    countEl.classList.toggle('has-items', qty > 0);
    const total = qty * CONFIG.price;
    $('[data-subtotal]').textContent = chf(total);
    const rest = CONFIG.freeShippingThreshold - total;
    $('[data-ship-text]').textContent = rest > 0
      ? `Noch ${chf(rest)} bis zum kostenlosen Versand`
      : 'Dein Versand ist kostenlos.';
    $('[data-ship-bar]').style.width = `${clamp(total / CONFIG.freeShippingThreshold) * 100}%`;
    const co = $('[data-checkout]');
    co.href = checkoutUrl();
    co.toggleAttribute('aria-disabled', qty === 0);
    co.style.pointerEvents = qty === 0 ? 'none' : '';
    co.style.opacity = qty === 0 ? '.5' : '';
    body.innerHTML = qty === 0
      ? `<div class="cart-empty"><p>Dein Warenkorb ist leer.</p><p>Beginne dein Abendritual.</p><a class="btn btn-primary" href="#produkt" data-cart-close-link><span>Night Gummies entdecken</span></a></div>`
      : `<div class="line-item">
          <img src="${CONFIG.image}" alt="">
          <div>
            <h3>${CONFIG.title}</h3>
            <p class="li-meta">${CONFIG.variantLabel}</p>
            <div class="qty" role="group" aria-label="Menge">
              <button type="button" data-cq="-1" aria-label="Menge verringern">−</button>
              <span aria-live="polite">${qty}</span>
              <button type="button" data-cq="1" aria-label="Menge erhöhen">+</button>
            </div>
          </div>
          <div class="li-right">
            <span class="li-price">${chf(total)}</span>
            <button class="li-remove" type="button" data-remove>Entfernen</button>
          </div>
        </div>`;
  }
  function openCart() {
    lastFocus = document.activeElement;
    scrim.hidden = false;
    requestAnimationFrame(() => { scrim.classList.add('is-on'); cart.classList.add('is-open'); });
    cart.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('[data-cart-close]').focus();
  }
  function closeCart() {
    scrim.classList.remove('is-on'); cart.classList.remove('is-open');
    cart.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { scrim.hidden = true; }, 500);
    if (lastFocus) lastFocus.focus();
  }
  $('[data-cart-open]').addEventListener('click', openCart);
  $('[data-cart-close]').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  body.addEventListener('click', e => {
    const b = e.target.closest('[data-cq]');
    if (b) { qty = clamp(qty + +b.dataset.cq, 0, 10); render(); }
    if (e.target.closest('[data-remove]')) { qty = 0; render(); }
    if (e.target.closest('[data-cart-close-link]')) closeCart();
  });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (cart.classList.contains('is-open')) closeCart();
    if (menu.classList.contains('is-open')) setMenu(false);
  });

  addBtn.addEventListener('click', () => {
    if (!CONFIG.available) return;
    qty = clamp(qty + (+qtyInput.value || 1), 1, 10);
    render();
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    setTimeout(openCart, 250);
  });
  render();

  /* ---------- Newsletter → Shopify customer form ---------- */
  const nl = $('[data-newsletter]');
  nl.addEventListener('submit', e => {
    e.preventDefault();
    const email = nl.querySelector('input[type=email]').value.trim();
    if (!email) return;
    const f = document.createElement('form');
    f.method = 'post'; f.action = `https://${CONFIG.shopDomain}/contact#newsletter`; f.target = '_blank';
    [['form_type', 'customer'], ['utf8', '✓'], ['contact[email]', email], ['contact[tags]', 'newsletter']].forEach(([n, v]) => {
      const i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = v; f.appendChild(i);
    });
    document.body.appendChild(f); f.submit(); f.remove();
    $('[data-newsletter-msg]').textContent = 'Danke! Bitte bestätige deine Anmeldung im neuen Tab.';
    nl.reset();
  });
  $$('[data-contact]').forEach(a => { a.href = `https://${CONFIG.shopDomain}/pages/contact`; });
})();
