// Weidmann Digital Solutions – Navigation, Sprache (DE/EN), Scroll- und 3D-Effekte, Partikelfeld, Kontaktformular
(() => {
  const cfg = window.WDS_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const conn = navigator.connection || {};
  const lite = reduce || conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '') || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  $('#year').textContent = new Date().getFullYear();

  // Links aus der Konfiguration
  if (cfg.digitalUrl) $$('[data-product-link="digital"]').forEach((a) => { a.href = cfg.digitalUrl; });
  const li = $('#linkedin');
  if (cfg.linkedinUrl) li.href = cfg.linkedinUrl; else li.style.display = 'none';

  // ── Navigation ──
  const nav = $('#nav'); const btn = $('#menuBtn'); const progress = $('#progress');
  const setMenu = (open) => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('locked', open); };
  btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); } });
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => setMenu(false));
  const navLinks = $$('[data-nav]');
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.dataset.nav === e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'about', 'solutions', 'vision', 'contact'].forEach((id) => { const el = document.getElementById(id); if (el) so.observe(el); });
  }

  // ── Sprache ──
  const EN = {
    'skip': 'Skip to content', 'nav.about': 'About', 'nav.solutions': 'Solutions', 'nav.contact': 'Contact', 'nav.cta': 'Get in Touch',
    'hero.sub': 'Intelligent AI. Powerful Automation. Digital Innovation.',
    'hero.cta1': 'Explore Our Solutions', 'hero.cta2': 'Get in Touch', 'fact1': 'Digital products', 'fact2': 'At the core of every product', 'fact3': 'Developed in Switzerland',
    'about.eyebrow': 'About',
    'about.text': 'Weidmann Digital Solutions combines artificial intelligence, intelligent automation and modern software development to create digital products that solve real-world business challenges.',
    'umb.text': 'As an umbrella brand, Weidmann Digital Solutions brings independent digital products together under one standard: technology that genuinely helps in everyday business – developed in Switzerland.',
    'ar1': 'AI agents and AI features that understand tasks and take them on.', 'ar2': 'Workflows that run by themselves – instead of manual routine.', 'ar3': 'From topic to finished short video for social media.', 'ar4': 'Web and app products that we build and operate ourselves.',
    'v1': 'Using AI where it creates real value – understandable, transparent and practical.',
    'v2': 'Automating repetitive tasks so there is more time for what matters.',
    'v3': 'Building, testing and continuously improving our own digital products.',
    'sol.eyebrow': 'Our Solutions', 'sol.t1': 'Three Products.', 'sol.t2': 'One Vision.',
    'sol.sub': 'Each product solves a specific job – from business automation to AI videos to personal sales follow-up.',
    'p1.text': 'Intelligent AI agents and automation solutions that help businesses streamline processes, reduce repetitive tasks and work more efficiently.',
    'p1.a': 'AI agents for repetitive tasks', 'p1.b': 'Automated workflows instead of manual routine', 'p1.c': 'Streamline processes and save time', 'p1.cta': 'Explore Weidmann Digital',
    'f1.t': 'Request received', 'f2.t': 'AI agent analyzes', 'f3.t': 'Task completed',
    'p2.text': 'Discover a smarter way to create AI-generated videos and social media content. Turn ideas into engaging video content through an automated creative workflow.',
    'p2.a': 'From topic to finished short video: script, images, voice and captions', 'p2.b': 'For TikTok, Instagram Reels and YouTube Shorts', 'p2.c': 'Try your first video for free', 'p2.cta': 'Discover TrueReel',
    'chip1': 'Script', 'chip2': 'Voice', 'chip3': 'Captions', 'chip4': 'Images',
    'p3.text': 'FollowUpAI helps small businesses manage leads, organize their sales pipeline and create personalized follow-up messages using real lead data.',
    'p3.a': 'Manage leads and organize your sales pipeline', 'p3.b': 'Personalized follow-ups from your real lead data', 'p3.c': 'Available for iPhone on the App Store', 'p3.cta': 'Download on the App Store',
    'msg.h': 'AI follow-up draft (example)', 'msg.t': 'Hi! I wanted to quickly check whether my offer from last week still works for you …',
    'why.eyebrow': 'Why Weidmann Digital Solutions',
    'w1.t': 'Artificial Intelligence', 'w1.d': 'AI where it creates real value – applied in an understandable and transparent way.',
    'w2.t': 'Intelligent Automation', 'w2.d': 'Automating recurring workflows so there is time for what matters.',
    'w3.t': 'Digital Product Development', 'w3.d': 'We build our own products, test them in real use and keep improving them.',
    'w4.t': 'Modern Software Solutions', 'w4.d': 'Web, app and cloud – thoughtfully built by one team.',
    'w5.t': 'Practical Innovation', 'w5.d': 'We build what businesses actually need in everyday work.',
    'vision.eyebrow': 'Our Vision',
    'vision.text': 'We believe intelligent technology should make everyday business simpler, smarter and more efficient. Our mission is to build digital products that turn this vision into reality.',
    'start.eyebrow': 'Next step', 'start.t1': 'Choose Your', 'start.t2': 'Starting Point.',
    'start.d1': 'AI agents and automation for your business.', 'start.d2': 'AI videos for social media – your first video is free.', 'start.d3': 'AI-powered CRM for small businesses – as an iPhone app.',
    'contact.eyebrow': 'Contact',
    'contact.text': 'Have an idea, a business challenge or an interest in our products? Let’s explore what’s possible.',
    'cp1': 'AI agents & automation for your business', 'cp2': 'Questions about TrueReel or FollowUpAI', 'cp3': 'Partnerships & collaboration',
    'form.title': 'Write to us', 'form.name': 'Name', 'form.email': 'Email', 'form.note': 'We reply personally by email. Fields marked * are required.', 'form.subject': 'Subject', 'form.message': 'Message',
    'form.consent': 'I agree that my details will be processed to answer my request. More in the <a href="datenschutz.html">privacy policy</a>.', 'form.submit': 'Send Message',
    'ft.slogan': 'Building the Digital Future. AI, automation and software from Switzerland.',
    'ft.company': 'Company', 'ft.products': 'Products', 'ft.legal': 'Legal', 'ft.privacy': 'Privacy Policy', 'ft.imprint': 'Legal Notice', 'ft.made': 'Developed in Switzerland', 'ft.ai': 'Imagery: AI-generated 3D visualizations',
  };
  const MSG = {
    de: { sending: 'Wird gesendet …', ok: 'Danke! Deine Nachricht ist angekommen – wir melden uns so bald wie möglich.', fix: 'Bitte prüfe die markierten Felder.', req: 'Bitte ausfüllen.', email: 'Bitte gib eine gültige E-Mail-Adresse ein.', consent: 'Bitte bestätige die Datenschutzerklärung.', fail: 'Das Senden hat nicht geklappt. Bitte versuche es später erneut.', many: 'Zu viele Anfragen. Bitte versuche es in einer Stunde erneut.', menu: 'Menü öffnen', nav: 'Hauptnavigation' },
    en: { sending: 'Sending …', ok: 'Thank you! Your message has arrived – we will get back to you as soon as possible.', fix: 'Please check the highlighted fields.', req: 'Please fill in this field.', email: 'Please enter a valid email address.', consent: 'Please accept the privacy policy.', fail: 'Sending failed. Please try again later.', many: 'Too many requests. Please try again in an hour.', menu: 'Open menu', nav: 'Main navigation' },
  };
  const DE = {};
  $$('[data-i18n]').forEach((el) => { DE[el.dataset.i18n] = el.textContent; });
  $$('[data-i18n-html]').forEach((el) => { DE[el.dataset.i18nHtml] = el.innerHTML; });
  const META = {
    de: { title: document.title, desc: $('meta[name="description"]').content },
    en: { title: 'Weidmann Digital Solutions – AI Agents, AI Business Automation & Software from Switzerland', desc: 'Weidmann Digital Solutions is the Swiss umbrella brand for artificial intelligence (AI), automation, software solutions and digital products: Weidmann Digital (AI agents), TrueReel (AI video creation) and FollowUpAI (follow-up CRM).' },
  };
  let lang = 'de';
  const setLang = (l, save) => {
    lang = l === 'en' ? 'en' : 'de';
    const dict = lang === 'en' ? EN : DE;
    $$('[data-i18n]').forEach((el) => { const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = lang;
    document.title = META[lang].title;
    $('meta[name="description"]').content = META[lang].desc;
    btn.setAttribute('aria-label', MSG[lang].menu); $('#navLinks').setAttribute('aria-label', MSG[lang].nav);
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('.field.invalid').forEach((f) => { f.classList.remove('invalid'); $('.err', f).textContent = ''; });
    if (save) { try { localStorage.setItem('wds-lang', lang); } catch { /* egal */ } }
  };
  $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang, true)));
  let initial = new URLSearchParams(location.search).get('lang');
  if (!initial) { try { initial = localStorage.getItem('wds-lang'); } catch { /* egal */ } }
  if (!initial && !/^de\b/i.test(navigator.language || '')) initial = 'en';
  if (initial === 'en') setLang('en');

  // ── Einblenden beim Scrollen ──
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach((el) => { if (el.closest('.hero')) requestAnimationFrame(() => el.classList.add('in')); else io.observe(el); });
  } else $$('.reveal').forEach((el) => el.classList.add('in'));

  // ── Videoschleifen: nur abspielen, wenn sichtbar; im Sparmodus bleibt das Standbild ──
  const vids = $$('video[data-autoplay]');
  if (lite) $$('video').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
  else if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: 0.1, rootMargin: '240px 0px' });
    vids.forEach((v) => vio.observe(v));
  }

  // ── Scroll-Fortschritt, Navigation, Schweben & Parallax (ein gemeinsamer Takt) ──
  const floats = reduce ? [] : $$('[data-float]');
  let mx = 0, my = 0, tx = 0, ty = 0, ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY; const vh = window.innerHeight;
    nav.classList.toggle('scrolled', y > 24);
    document.documentElement.style.setProperty('--p', Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(4));
    mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
    floats.forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
      const p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / vh));
      el.style.setProperty('--sy', p.toFixed(3)); el.style.setProperty('--mx', mx.toFixed(3)); el.style.setProperty('--my', my.toFixed(3));
    });
    if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) request();
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  if (fine && !reduce) window.addEventListener('pointermove', (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; request(); }, { passive: true });
  request();

  // ── Karten: leuchtender Rand folgt der Maus, Produktkarten neigen sich leicht in 3D ──
  if (fine && !reduce) {
    $$('.glow').forEach((el) => {
      const tilt = el.hasAttribute('data-tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
        if (tilt) { el.classList.add('tilting'); el.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`); el.style.setProperty('--rx', `${((0.5 - y) * 4).toFixed(2)}deg`); }
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('tilting'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  // ── Hero: 3D-Partikelfeld um den Kern (Canvas, pausiert ausserhalb des Bildschirms) ──
  const cv = $('#field');
  if (cv && !lite) {
    const ctx = cv.getContext('2d'); const dpr = Math.min(1.75, window.devicePixelRatio || 1);
    let w = 0, h = 0, cx = 0, cy = 0, R = 0, pts = [], raf = null, t = 0, last = 0;
    const build = () => {
      w = cv.clientWidth; h = cv.clientHeight; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 760;
      cx = mobile ? w / 2 : w * 0.72; cy = mobile ? w * 0.52 + 54 : h * 0.5; R = mobile ? w * 0.62 : Math.min(w * 0.42, h * 0.62);
      const n = mobile ? 70 : 170;
      pts = Array.from({ length: n }, (_, i) => {
        const u = Math.random() * 2 - 1; const a = Math.random() * Math.PI * 2; const s = Math.sqrt(1 - u * u);
        const rad = 0.55 + Math.pow(Math.random(), 0.7) * 1.25; // Schalen um den Kern, nach aussen dünner
        return { x: s * Math.cos(a) * rad, y: u * rad * 0.8, z: s * Math.sin(a) * rad, r: Math.random() * 1.3 + 0.35, tw: Math.random() * Math.PI * 2, c: i % 5 === 0 };
      });
    };
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 30) return; // ~33 Bilder/Sekunde reichen für langsame Partikel
      t += Math.min(0.05, (now - last) / 1000) * 0.07; last = now;
      const ay = t + mx * 0.35; const ax = 0.28 + my * 0.2;
      const cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax);
      const fade = Math.max(0, 1 - window.scrollY / (h * 0.9));
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const x1 = p.x * cyA + p.z * syA; const z1 = -p.x * syA + p.z * cyA;
        const y1 = p.y * cxA - z1 * sxA; const z2 = p.y * sxA + z1 * cxA;
        const k = 2.6 / (2.6 + z2); const sx = cx + x1 * R * k; const sy = cy + y1 * R * k;
        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;
        const a = Math.max(0, Math.min(1, (1.5 - z2) / 2.6)) * (0.45 + 0.55 * Math.sin(now / 900 + p.tw) ** 2) * fade;
        ctx.globalAlpha = a * 0.85; ctx.fillStyle = p.c ? '#39D5FF' : '#CFE6FF';
        ctx.beginPath(); ctx.arc(sx, sy, p.r * k, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    build();
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150); });
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); } else { cancelAnimationFrame(raf); raf = null; } }).observe(cv);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = null; } else if (!raf && window.scrollY < h) raf = requestAnimationFrame(draw); });
  }

  // ── Kontaktformular: Felder prüfen, senden, Erfolg nur nach Bestätigung des Servers ──
  const form = $('#contactForm'); const status = $('#formStatus');
  const show = (text, cls) => { status.textContent = text; status.className = `form-status ${cls || ''}`; };
  const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
  const check = (el) => {
    const v = el.value.trim(); let m = '';
    if (el.required && !v) m = MSG[lang].req; else if (el.type === 'email' && v && !EMAIL.test(v)) m = MSG[lang].email;
    const f = el.closest('.field'); const err = $('.err', f);
    f.classList.toggle('invalid', !!m); el.setAttribute('aria-invalid', String(!!m)); if (err) err.textContent = m;
    return !m;
  };
  const inputs = $$('.field input, .field textarea', form);
  inputs.forEach((el) => { el.addEventListener('blur', () => { if (el.value.trim() || el.closest('.field').classList.contains('invalid')) check(el); }); el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) check(el); }); });
  const consentErr = $('#e-consent');
  form.consent.addEventListener('change', () => { if (form.consent.checked) consentErr.textContent = ''; });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = inputs.filter((el) => !check(el));
    const consentOk = form.consent.checked; consentErr.textContent = consentOk ? '' : MSG[lang].consent;
    if (bad.length || !consentOk) { (bad[0] || form.consent).focus(); return show(MSG[lang].fix, 'err'); }
    const d = Object.fromEntries(new FormData(form));
    const submit = $('button[type=submit]', form); submit.disabled = true; show(MSG[lang].sending);
    try {
      const r = await fetch(cfg.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, email: d.email, subject: d.subject, message: d.message, website: d.website, lang }) });
      if (r.status === 429) { show(MSG[lang].many, 'err'); submit.disabled = false; return; }
      const j = r.ok ? await r.json().catch(() => null) : null;
      if (!j || j.ok !== true) throw new Error(String(r.status));
      form.reset(); show(MSG[lang].ok, 'ok');
    } catch { show(MSG[lang].fail, 'err'); }
    submit.disabled = false;
  });
})();
