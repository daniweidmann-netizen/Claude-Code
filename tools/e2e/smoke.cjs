/**
 * End-to-end smoke test of the built client (run `npm run build:client` and
 * `npx vite preview --port 4173` first):  node tools/e2e/smoke.cjs [outDir]
 *
 * Plays normal and bought rounds through the real UI in portrait and
 * landscape, opens bonus chambers by clicking them, and checks that
 *  - no console or page error occurs,
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
  for (const [name, w, h] of [['portrait', 390, 844], ['landscape', 1280, 720], ['small', 360, 640]]) {
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    p.on('console', (m) => { if (m.type() === 'error') problems.push(`${name}: ${m.text()}`); });
    p.on('pageerror', (e) => problems.push(`${name}: ${e.message}`));
    await p.goto(`${URL}?seed=${name.length * 1000}&fast=25&balance=5000000`);
    await p.waitForFunction(() => window.__tls, null, { timeout: 20000 });
    if (out) await p.screenshot({ path: `${out}/${name}_idle.png` });
    let balance = (await p.evaluate(() => window.__tls.state())).balance;
    for (let i = 0; i < 40; i++) {
      const kind = i % 8 === 7 ? 'buy' : 'spin';
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
    console.log(name, 'rounds 40, balance', balance);
    await p.close();
  }
  await browser.close();
  console.log('chamber picks made through the UI:', picksSeen);
  if (picksSeen === 0) problems.push('no Temple Bonus occurred; the pick path was not exercised');
  if (problems.length) { console.error('FAILED\n' + problems.join('\n')); process.exit(1); }
  console.log('OK');
})();
