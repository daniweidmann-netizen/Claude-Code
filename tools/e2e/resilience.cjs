/**
 * Restart and error-handling checks (preview server on port 4173):  node tools/e2e/resilience.cjs
 *  1. Reload in the middle of a round: the demo starts fresh (no recovery exists) without errors.
 *  2. All symbol images blocked: the game still starts and plays with code-drawn placeholders.
 *  3. All audio blocked: the game plays; the synthesised fallback is used.
 *  4. Offline after load: a round still completes (the engine runs in the page).
 */
const { chromium } = require('playwright');
const URL = process.env.TLS_URL || 'http://localhost:4173/';
(async () => {
  const browser = await chromium.launch();
  const problems = [], note = [];
  const open = async (q, setup) => {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    if (setup) await setup(p, ctx);
    await p.goto(URL + q);
    await p.waitForFunction(() => window.__tls && window.__tls.state().canvas[0] > 0, null, { timeout: 60000 });
    await p.waitForTimeout(1500);
    return { p, ctx, errs };
  };
  const round = async (p) => {
    await p.evaluate(() => window.__tls.spin());
    for (let i = 0; i < 600; i++) {
      const s = await p.evaluate(() => window.__tls.state());
      if (!s.busy) return s;
      if (s.modal) for (const d of s.doors) await p.mouse.click(d.x, d.y);
      await p.waitForTimeout(200);
    }
    throw new Error('round did not finish');
  };
  { // 1
    const { p, errs } = await open('?start=0&seed=57&fast=3');
    await p.evaluate(() => window.__tls.spin());
    await p.waitForTimeout(1200);
    const mid = await p.evaluate(() => window.__tls.state());
    await p.reload();
    await p.waitForFunction(() => window.__tls && window.__tls.state().canvas[0] > 0, null, { timeout: 60000 });
    await p.waitForTimeout(1000);
    const after = await p.evaluate(() => window.__tls.state());
    note.push(`reload mid-round: busy before ${mid.busy}, after reload busy ${after.busy}, balance ${after.balance}, history ${after.history.length}`);
    if (!mid.busy) problems.push('reload: round was not running');
    if (after.busy || after.balance !== 100000 || after.history.length !== 0) problems.push('reload: not a clean fresh start');
    const s = await round(p);
    if (s.history.length !== 1) problems.push('reload: cannot play after reload');
    if (errs.length) problems.push('reload: ' + errs.join(' | '));
    await p.close();
  }
  { // 2
    const { p, errs } = await open('?start=0&seed=5&fast=4', (pg) => pg.route('**/symbols/**', (r) => r.abort()));
    const s0 = await p.evaluate(() => window.__tls.state());
    const s = await round(p);
    note.push(`images blocked: load errors ${s0.loadErrors.length}, round win ${s.history[0] && s.history[0].win}, mismatches ${s.mismatches}`);
    if (s0.loadErrors.length < 9) problems.push('images: expected 9 load errors');
    if (!s.history[0] || s.history[0].win !== 220 || s.mismatches) problems.push('images: round result wrong with placeholders');
    if (errs.length) problems.push('images: ' + errs.join(' | '));
    await p.close();
  }
  { // 3
    const { p, errs } = await open('?start=0&seed=5&fast=4', (pg) => pg.route('**/audio/**', (r) => r.abort()));
    await p.mouse.click(200, 300);
    const s = await round(p);
    note.push(`audio blocked: loaded ${s.audioLoaded}, failed ${s.audioFailed}, round win ${s.history[0] && s.history[0].win}`);
    if (!s.history[0] || s.history[0].win !== 220) problems.push('audio: round result wrong');
    if (errs.length) problems.push('audio: ' + errs.join(' | '));
    await p.close();
  }
  { // 4
    const { p, ctx, errs } = await open('?start=0&seed=5&fast=4');
    await ctx.setOffline(true);
    const s = await round(p);
    note.push(`offline after load: round win ${s.history[0] && s.history[0].win}`);
    if (!s.history[0] || s.history[0].win !== 220) problems.push('offline: round result wrong');
    if (errs.length) problems.push('offline: ' + errs.join(' | '));
    await p.close();
  }
  await browser.close();
  console.log(note.join('\n'));
  console.log(problems.length ? 'PROBLEMS\n' + problems.join('\n') : 'RESILIENCE CHECKS OK');
  process.exit(problems.length ? 1 : 0);
})();
