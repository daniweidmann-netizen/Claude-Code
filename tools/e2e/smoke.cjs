/**
 * End-to-end smoke test of the built client (run `npm run build:client` and
 * `npx vite preview --port 4173` first):  node tools/e2e/smoke.cjs [outDir]
 *
 * Plays normal and bought rounds through the real UI in portrait and
 * landscape, opens bonus chambers by clicking them, and checks that
 *  - no console or page error occurs, all art loads, the canvas renders at device resolution,
 *  - one run uses reduced motion (?motion=reduced),
 *  - the drawn grid always equals the grid in the event log (mismatches = 0),
 *  - the displayed books equal stake and win of the round history.
 */
const { chromium } = require('playwright');
const out = process.argv[2];
const URL = process.env.TLS_URL || 'http://localhost:4173/';

async function finishRound(p, w, h) {
  for (;;) {
    await p.waitForFunction(() => !window.__tls.state().busy || window.__tls.state().modal, null, { timeout: 120000 });
    const s = await p.evaluate(() => window.__tls.state());
    if (!s.busy) return;
    // A chamber pick is pending: click the chambers from left to right.
    const u = Math.min(w, h) / 390, cw = Math.min(104 * u, (w * 0.9) / 3 - 8);
    for (let i = 0; i < 3; i++) await p.mouse.click(w / 2 + (i - 1) * (cw + 10), h * 0.55);
    await p.waitForTimeout(150);
  }
}

(async () => {
  const browser = await chromium.launch();
  const problems = [];
  let picksSeen = 0;
  // name, CSS width, CSS height, device pixel ratio, extra query
  // The high-density run is short: headless Chromium renders in software, which is slow at device resolution.
  for (const [name, w, h, dsf, extra, rounds] of [['portrait', 390, 844, 1, '', 40], ['landscape', 1280, 720, 1, '', 40], ['small', 360, 640, 1, '&motion=reduced', 40], ['hidpi', 390, 844, 3, '', 4]]) {
    const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
    p.on('console', (m) => { if (m.type() === 'error') problems.push(`${name}: ${m.text()}`); });
    p.on('pageerror', (e) => problems.push(`${name}: ${e.message}`));
    await p.goto(`${URL}?seed=${name.length * 1000}&fast=25&balance=5000000${extra}`);
    await p.waitForFunction(() => window.__tls, null, { timeout: 20000 });
    const env = await p.evaluate(() => window.__tls.state());
    const dpr = Math.min(dsf, 2);
    if (env.dpr !== dpr) problems.push(`${name}: dpr ${env.dpr}`);
    if (env.canvas[0] !== w * dpr || env.canvas[1] !== h * dpr) problems.push(`${name}: canvas ${env.canvas} for ${w}x${h}@${dpr}`);
    if (env.loadErrors.length) problems.push(`${name}: assets failed to load: ${env.loadErrors}`);
    if (env.textureSize !== 256) problems.push(`${name}: symbol art not in use (texture ${env.textureSize})`);
    if (env.reducedMotion !== extra.includes('reduced')) problems.push(`${name}: reducedMotion ${env.reducedMotion}`);
    if (out) await p.screenshot({ path: `${out}/${name}_idle.png` });
    let balance = (await p.evaluate(() => window.__tls.state())).balance;
    for (let i = 0; i < rounds; i++) {
      const kind = i % 8 === (rounds < 8 ? 3 : 7) ? 'buy' : 'spin';
      await p.evaluate((k) => window.__tls[k](), kind);
      if (out && kind === 'buy' && i === 7) { await p.waitForTimeout(400); await p.screenshot({ path: `${out}/${name}_freespins.png` }); }
      await finishRound(p, w, h);
      const s = await p.evaluate(() => window.__tls.state());
      const last = s.history[0];
      balance += last.win - last.stake;
      picksSeen += last.picks.length;
      if (last.kind !== kind) problems.push(`${name}: round ${i} kind ${last.kind}`);
      if (s.balance !== balance) problems.push(`${name}: round ${i} balance ${s.balance} != ${balance}`);
      if (s.mismatches !== 0) problems.push(`${name}: round ${i} grid mismatches ${s.mismatches}`);
    }
    if (out) await p.screenshot({ path: `${out}/${name}_end.png` });

    // Autoplay: ten rounds, books still exact, controls return afterwards.
    const before = await p.evaluate(() => window.__tls.state().rounds);
    await p.evaluate(() => window.__tls.auto());
    for (;;) {
      await finishRound(p, w, h);
      const s = await p.evaluate(() => window.__tls.state());
      if (s.autoLeft === 0 && !s.busy) break;
      await p.waitForTimeout(30);
    }
    const afterAuto = await p.evaluate(() => window.__tls.state());
    if (afterAuto.rounds - before !== 10) problems.push(`${name}: autoplay played ${afterAuto.rounds - before} rounds`);
    if (afterAuto.mismatches !== 0) problems.push(`${name}: grid mismatches after autoplay`);

    // Info panel through the real button: rules, paytable, history.
    const u = w >= h ? Math.min(w / 900, h / 480) : Math.min(w / 390, h / 760), m = Math.round(Math.min(w, h) * 0.03);
    await p.mouse.click(w - m - (w >= h ? 150 : 124) * u, m + 22 * u);
    await p.waitForSelector('.tls-info.open', { timeout: 5000 }).catch(() => problems.push(`${name}: info panel did not open`));
    const rules = await p.locator('.tls-info main').innerText().catch(() => '');
    if (!rules.includes('Nicht zertifiziert') || !rules.includes('Expedition Track')) problems.push(`${name}: rules text incomplete`);
    if (out) await p.screenshot({ path: `${out}/${name}_rules.png` });
    await p.getByRole('tab', { name: 'Auszahlungen' }).click();
    if (await p.locator('.tls-info td').count() !== 40) problems.push(`${name}: paytable cells`);
    if (out) await p.screenshot({ path: `${out}/${name}_paytable.png` });
    await p.getByRole('tab', { name: 'Verlauf' }).click();
    if (await p.locator('.tls-info tbody tr').count() !== Math.min(50, rounds + 10)) problems.push(`${name}: history rows`);
    await p.getByRole('button', { name: 'Schliessen' }).click();
    if (await p.locator('.tls-info.open').count() !== 0) problems.push(`${name}: info panel did not close`);
    console.log(name, 'rounds', rounds, 'balance', balance);
    await p.close();
  }
  await browser.close();
  console.log('chamber picks made through the UI:', picksSeen);
  if (picksSeen === 0) problems.push('no Temple Bonus occurred; the pick path was not exercised');
  if (problems.length) { console.error('FAILED\n' + problems.join('\n')); process.exit(1); }
  console.log('OK');
})();
