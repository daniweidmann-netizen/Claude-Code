// Weidmann Digital Solutions – Navigation, Sprache (DE/EN), Scroll-Animationen, Hero-Netz, Kontaktformular
(() => {
  const cfg = window.WDS_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $('#year').textContent = new Date().getFullYear();

  // Links aus der Konfiguration
  if (cfg.digitalUrl) $$('[data-product-link="digital"]').forEach((a) => { a.href = cfg.digitalUrl; });
  const li = $('#linkedin');
  if (cfg.linkedinUrl) li.href = cfg.linkedinUrl; else li.style.display = 'none';

  // Navigation
  const nav = $('#nav'); const btn = $('#menuBtn');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }));

  // ── Sprache ──
  const EN = {
    'nav.about': 'About', 'nav.solutions': 'Solutions', 'nav.vision': 'Vision', 'nav.contact': 'Contact', 'nav.cta': 'Get in Touch',
    'hero.eyebrow': 'AI · Automation · Software', 'hero.t1': 'Building the', 'hero.t2': 'Digital Future.',
    'hero.sub': 'Intelligent AI. Powerful Automation. Digital Innovation.',
    'hero.cta1': 'Explore Our Solutions', 'hero.cta2': 'Get in Touch', 'fact1': 'Digital products', 'fact2': 'At the core of every product', 'fact3': 'Developed in Switzerland', 'tag.ai': 'Artificial Intelligence', 'tag.auto': 'Automation', 'tag.sw': 'Software',
    'about.eyebrow': 'About us',
    'about.text': 'Weidmann Digital Solutions combines artificial intelligence, automation and modern software development. Our goal is to build innovative digital products that solve real challenges and support businesses for the long term.',
    'v1': 'Using AI where it creates real value – understandable, transparent and practical.',
    'v2': 'Automating repetitive tasks so there is more time for what matters.',
    'v3': 'Building, testing and continuously improving our own digital products.',
    'sol.eyebrow': 'Our Solutions', 'sol.t1': 'Three products.', 'sol.t2': 'One vision.',
    'sol.sub': 'Each product solves a specific job – from business automation to AI videos to personal sales follow-up.',
    'p1.text': 'Intelligent AI agents and automation solutions that support businesses with repetitive tasks, optimize processes and save valuable time.',
    'p1.a': 'AI agents for repetitive tasks', 'p1.b': 'Automated workflows instead of manual routine', 'p1.c': 'Optimize processes and save time', 'p1.cta': 'Explore Weidmann Digital',
    'f1.t': 'Request received', 'f1.s': 'Email, form or message', 'f2.t': 'AI agent analyzes', 'f2.s': 'Understand and classify', 'f3.t': 'Task completed', 'f3.s': 'Forwarded, logged, answered',
    'p2.text': 'TrueReel makes the automated creation of AI-generated videos and social media content accessible. Discover new possibilities for efficient content production.',
    'p2.a': 'From topic to finished short video: script, images, voice and captions', 'p2.b': 'For TikTok, Instagram Reels and YouTube Shorts', 'p2.c': 'Try your first video for free', 'p2.cta': 'Discover TrueReel',
    'ph.title': 'Topic → Video', 'ph.cap1': 'created', 'ph.cap2': 'automatically', 'pv.note': 'Real sample video from TrueReel · AI-generated images and voice', 'chip1': 'Script', 'chip2': 'Voice', 'chip3': 'Captions',
    'p3.text': 'FollowUpAI is an AI-powered CRM for small businesses. Manage leads, organize your sales pipeline and generate personalized follow-up messages based on your actual lead data.',
    'p3.a': 'Manage leads and organize your sales pipeline', 'p3.b': 'Personalized follow-ups from your real lead data', 'p3.c': 'Available for iPhone on the App Store', 'p3.cta': 'Download on the App Store',
    'col1': 'New', 'col2': 'Contacted', 'col3': 'Proposal', 'msg.h': 'AI follow-up draft', 'msg.t': 'Hi! I wanted to quickly check whether my offer from last week still works for you …',
    'why.eyebrow': 'Why Weidmann Digital Solutions', 'why.t1': 'Technology That Moves', 'why.t2': 'Businesses Forward.',
    'w1.t': 'Innovative AI technologies', 'w1.d': 'Current AI models, used where they make sense.', 'w2.t': 'Practical digital solutions', 'w2.d': 'Tools that work in everyday business.',
    'w3.t': 'Intelligent automation', 'w3.d': 'Less routine, more focus.', 'w4.t': 'Modern software products', 'w4.d': 'Web, app and cloud – from one team.',
    'w5.t': 'Focus on real problems', 'w5.d': 'We build what businesses actually need.',
    'vision.eyebrow': 'Our Vision', 'vision.t1': 'Creating What', 'vision.t2': 'Comes Next.',
    'vision.text': 'We believe in a future where intelligent technologies open up new opportunities for businesses. With our digital products, we want to actively shape that future.',
    'contact.eyebrow': 'Contact', 'contact.t1': 'Let’s Build', 'contact.t2': 'Something Great.',
    'contact.text': 'Want to digitize your business, automate processes or learn more about our products? We look forward to hearing from you.',
    'cp1': 'AI agents & automation for your business', 'cp2': 'Questions about TrueReel or FollowUpAI', 'cp3': 'Partnerships & collaboration',
    'form.title': 'Write to us', 'form.name': 'Name', 'form.email': 'Email address', 'form.company': 'Company', 'form.optional': '(optional)', 'form.subject': 'Subject', 'form.message': 'Message',
    'form.consent': 'I agree that my details will be processed to answer my request. More in the <a href="datenschutz.html">privacy policy</a>.', 'form.submit': 'Get in Touch',
    'ft.company': 'Company', 'ft.products': 'Products', 'ft.legal': 'Legal', 'ft.privacy': 'Privacy Policy', 'ft.imprint': 'Legal Notice', 'ft.made': 'Developed in Switzerland', 'ft.ai': 'Imagery: AI-generated visualizations', 'cine.cap': 'Digital architecture – built with precision.',
  };
  const MSG = {
    de: { sending: 'Wird gesendet …', ok: 'Danke! Deine Nachricht ist angekommen – wir melden uns so bald wie möglich.', invalid: 'Bitte fülle alle Pflichtfelder aus und bestätige die Datenschutzerklärung.', email: 'Bitte gib eine gültige E-Mail-Adresse ein.', fail: 'Das Senden hat nicht geklappt. Bitte versuche es später erneut.', menu: 'Menü öffnen' },
    en: { sending: 'Sending …', ok: 'Thank you! Your message has arrived – we will get back to you as soon as possible.', invalid: 'Please fill in all required fields and accept the privacy policy.', email: 'Please enter a valid email address.', fail: 'Sending failed. Please try again later.', menu: 'Open menu' },
  };
  const DE = {};
  $$('[data-i18n]').forEach((el) => { DE[el.dataset.i18n] = el.textContent; });
  $$('[data-i18n-html]').forEach((el) => { DE[el.dataset.i18nHtml] = el.innerHTML; });
  const META = {
    de: { title: document.title, desc: $('meta[name="description"]').content },
    en: { title: 'Weidmann Digital Solutions – Building the Digital Future.', desc: 'Weidmann Digital Solutions from Switzerland builds AI solutions, intelligent automation and digital software products: Weidmann Digital, TrueReel and FollowUpAI.' },
  };
  let lang = 'de';
  const setLang = (l) => {
    lang = l === 'en' ? 'en' : 'de';
    const dict = lang === 'en' ? EN : DE;
    $$('[data-i18n]').forEach((el) => { const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = lang;
    document.title = META[lang].title;
    $('meta[name="description"]').content = META[lang].desc;
    btn.setAttribute('aria-label', MSG[lang].menu);
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('wds-lang', lang); } catch { /* egal */ }
  };
  $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let initial = new URLSearchParams(location.search).get('lang');
  if (!initial) { try { initial = localStorage.getItem('wds-lang'); } catch { /* egal */ } }
  if (!initial && !/^de\b/i.test(navigator.language || '')) initial = 'en';
  if (initial === 'en') setLang('en');

  // ── Scroll-Animationen ──
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else $$('.reveal').forEach((el) => el.classList.add('in'));

  // ── Hero: dezentes Netzwerk (Canvas, pausiert ausserhalb des Bildschirms) ──
  const cv = $('#net');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let w, h, pts = [], raf = null, dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.4 + 0.4 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]; const dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 16000) { ctx.strokeStyle = `rgba(22,139,255,${0.16 * (1 - d / 16000)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        ctx.fillStyle = 'rgba(120,200,255,0.7)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize);
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!raf) draw(); } else { cancelAnimationFrame(raf); raf = null; } }).observe(cv);
  }

  // ── Videoschleifen: nur abspielen, wenn sichtbar (spart Akku und Daten) ──
  const vids = $$('video[data-autoplay]');
  if (vids.length && 'IntersectionObserver' in window && !reduce) {
    const vio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: 0.15, rootMargin: '200px 0px' });
    vids.forEach((v) => vio.observe(v));
  }
  if (reduce) $$('video').forEach((v) => { v.autoplay = false; v.pause(); });

  // ── Schweben & Parallax: Objekte reagieren auf Scrollen und Maus ──
  const floats = $$('[data-float]');
  if (floats.length && !reduce) {
    let mx = 0, my = 0, tx = 0, ty = 0, ticking = false;
    const update = () => {
      ticking = false; mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      const vh = window.innerHeight;
      floats.forEach((el) => {
        const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
        const p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / vh)); // -1 oben … 1 unten
        el.style.setProperty('--sy', p.toFixed(3)); el.style.setProperty('--mx', mx.toFixed(3)); el.style.setProperty('--my', my.toFixed(3));
      });
      if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) request();
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('pointermove', (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; request(); }, { passive: true });
    request();
  }

  // ── Kontaktformular ──
  const form = $('#contactForm'); const status = $('#formStatus');
  const show = (t, cls) => { status.textContent = t; status.className = `form-status ${cls || ''}`; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (!d.name?.trim() || !d.email?.trim() || !d.subject?.trim() || !d.message?.trim() || !form.consent.checked) return show(MSG[lang].invalid, 'err');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) return show(MSG[lang].email, 'err');
    const submit = form.querySelector('button[type=submit]'); submit.disabled = true; show(MSG[lang].sending);
    try {
      const r = await fetch(cfg.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, email: d.email, company: d.company, subject: d.subject, message: d.message, website: d.website, lang }) });
      if (!r.ok) throw new Error(String(r.status));
      form.reset(); show(MSG[lang].ok, 'ok');
    } catch { show(MSG[lang].fail, 'err'); }
    submit.disabled = false;
  });
})();
