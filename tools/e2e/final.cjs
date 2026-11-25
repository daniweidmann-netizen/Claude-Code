/**
 * Checks added with the final polish (preview server on port 4173 first):  node tools/e2e/final.cjs [outDir]
 *  1. Title screen: the start button exists, is on screen and starts the game, in five formats.
 *  2. Layout in tablet and desktop formats: texts and buttons on screen.
 *  3. No empty play field: while a new spin replaces an old grid, the field never shows fewer
 *     symbols than a full grid (sampled every animation frame).
 *  4. Presentation mode: runs its four prepared rounds, is labelled, leaves balance and history
 *     untouched, and the game is playable afterwards.
 */
const { chromium } = require('playwright');
const out = process.argv[2];
const URL = process.env.TLS_URL || 'http://localhost:4173/';
(async () => {
  const browser = await chromium.launch();
  const problems = [];
  const note = [];
  const page = async (w, h, q) => {
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    p.on('console', (m) => { if (m.type() === 'error') problems.push(`${w}x${h}: ${m.text()}`); });
    p.on('pageerror', (e) => problems.push(`${w}x${h}: ${e.message}`));
    await p.goto(URL + q);
    await p.waitForFunction(() => window.__tls && window.__tls.state().textureSize > 0, null, { timeout: 60000 });
    return p;
  };
  // 1 + 2
  for (const [name, w, h] of [['phoneNarrow', 360, 640], ['phoneLarge', 430, 932], ['tablet', 768, 1024], ['desktop1366', 1366, 768], ['desktop1920', 1920, 1080]]) {
    const p = await page(w, h, '?fast=3');
    await p.waitForTimeout(900);
    let s = await p.evaluate(() => window.__tls.state());
    if (s.started) problems.push(`${name}: title screen missing`);
    const b = s.startButton;
    if (!b || b.x < 40 || b.x > w - 40 || b.y < 40 || b.y > h - 40) problems.push(`${name}: start button off screen ${JSON.stringify(b)}`);
    if (out) await p.screenshot({ path: `${out}/title-${name}.png` });
    if (b) await p.mouse.click(b.x, b.y);
    await p.waitForTimeout(700);
    s = await p.evaluate(() => window.__tls.state());
    if (!s.started) problems.push(`${name}: start button did not start the game`);
    for (const r of [...s.texts, ...s.buttons]) {
      if (r.w > 0 && (r.x < -1 || r.y < -1 || r.x + r.w > w + 1 || r.y + r.h > h + 1)) problems.push(`${name}: off screen ${r.name || r.text}`);
    }
    for (const r of s.buttons) if (r.w > 0 && Math.min(r.w, r.h) < 40) problems.push(`${name}: small button ${r.name} ${Math.round(r.w)}x${Math.round(r.h)}`);
    if (out) await p.screenshot({ path: `${out}/game-${name}.png` });
    if (s.loadErrors.length) problems.push(`${name}: ${s.loadErrors}`);
    await p.close();
  }
  // 3
  {
    const p = await page(393, 852, '?start=0&seed=11&speed=normal');
    await p.evaluate(() => {
      window.__min = 999; window.__samples = 0;
      const tick = () => { const s = window.__tls.state(); if (s.busy) { window.__samples++; if (window.__watch) window.__min = Math.min(window.__min, s.field); } requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    // Only the changeover from one grid to the next is watched (the first 600 ms of a spin);
    // later in a spin, winning symbols are removed on purpose.
    for (let i = 0; i < 5; i++) {
      await p.evaluate(() => { window.__watch = true; window.__tls.spin(); setTimeout(() => { window.__watch = false; }, 600); });
      if (out && i === 1) { await p.waitForTimeout(230); await p.screenshot({ path: `${out}/refill.png` }); }
      await p.waitForFunction(() => !window.__tls.state().busy, null, { timeout: 120000 });
    }
    const r = await p.evaluate(() => ({ min: window.__min, samples: window.__samples }));
    note.push(`refill: least symbols inside the field during spins = ${r.min} of 30 (${r.samples} frames sampled, 24 required: one row may be passing the edge)`);
    if (r.samples < 20) problems.push('refill: too few samples');
    if (r.min < 24) problems.push(`refill: field showed only ${r.min} symbols`);
    await p.close();
  }
  // 4
  {
    const p = await page(393, 852, '?start=0&demo=1&speed=skip&fast=5');
    await p.waitForFunction(() => window.__tls.state().demo > 0, null, { timeout: 30000 });
    const before = await p.evaluate(() => window.__tls.state());
    const seen = new Set();
    for (let guard = 0; guard < 4000; guard++) {
      const s = await p.evaluate(() => window.__tls.state());
      if (s.demo === 0 && !s.busy) break;
      if (!seen.has(s.demo)) { seen.add(s.demo); if (out) { await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/demo-${s.demo}.png` }); } }
      await p.waitForTimeout(250);
    }
    await p.waitForTimeout(2500);
    const after = await p.evaluate(() => window.__tls.state());
    note.push(`demo: steps seen ${[...seen].join(',')}, mismatches ${after.mismatches}`);
    if (seen.size !== 4) problems.push(`demo: saw steps ${[...seen]}`);
    if (after.balance !== before.balance) problems.push('demo: balance changed');
    if (after.history.length !== 0) problems.push('demo: history changed');
    if (after.mismatches) problems.push('demo: grid mismatches');
    if (after.freeMode || after.tension) problems.push('demo: scenery not back to base game');
    await p.evaluate(() => window.__tls.spin());
    await p.waitForTimeout(400);
    await p.waitForFunction(() => !window.__tls.state().busy || window.__tls.state().modal, null, { timeout: 120000 });
    const played = await p.evaluate(() => window.__tls.state());
    if (played.history.length !== 1) problems.push('demo: normal play did not continue');
    await p.close();
  }
  // 5: presentation mode (demo build only): labelled, fixed seed, the real Temple Bonus with a real pick
  {
    const p = await page(393, 852, '?present=temple&start=0&fast=4');
    let s = await p.evaluate(() => window.__tls.state());
    if (!s.presentation || !/PRESENTATION MODE/.test(s.presentChip)) problems.push('present: mode or label missing');
    for (let round = 0; round < 2; round++) {
      await p.evaluate(() => window.__tls.spin());
      await p.waitForFunction(() => window.__tls.state().modal, null, { timeout: 120000 });
      await p.waitForTimeout(1500);
      s = await p.evaluate(() => window.__tls.state());
      if (out && round === 0) await p.screenshot({ path: `${out}/present-bonus.png` });
      const d = s.doors[round === 0 ? 2 : 1];
      for (let k = 0; k < 40 && (await p.evaluate(() => window.__tls.state().busy)); k++) {
        await p.mouse.click(d.x, d.y); await p.waitForTimeout(1500);
        const st = await p.evaluate(() => window.__tls.state());
        if (st.modal) for (const dd of st.doors) await p.mouse.click(dd.x, dd.y);
      }
    }
    s = await p.evaluate(() => window.__tls.state());
    note.push(`present: rounds ${s.history.length}, seeds ${s.history.map((h) => h.seed).join(',')}, picks ${s.history.map((h) => h.picks.join('+')).join(' / ')}, mismatches ${s.mismatches}`);
    if (s.history.length !== 2 || s.history.some((h) => h.seed !== '1168')) problems.push('present: seed not fixed');
    if (s.mismatches) problems.push('present: grid mismatches');
    if (!/PRESENTATION MODE/.test(s.presentChip)) problems.push('present: label lost');
    await p.close();
    // normal play is not affected: without the parameter the seed is random and there is no label
    const q = await page(393, 852, '?start=0&fast=4');
    const n = await q.evaluate(() => window.__tls.state());
    if (n.presentation || n.presentChip) problems.push('present: active without parameter');
    await q.close();
  }
  await browser.close();
  console.log(note.join('\n'));
  console.log(problems.length ? 'PROBLEMS\n' + problems.join('\n') : 'FINAL CHECKS OK');
  process.exit(problems.length ? 1 : 0);
})();
