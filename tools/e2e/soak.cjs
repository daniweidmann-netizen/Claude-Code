/**
 * Long-session check of the built client: plays many rounds at high speed and
 * samples memory and object counts. A leak shows as steady growth.
 *   node tools/e2e/soak.cjs [rounds]      (preview server on port 4173)
 * Chromium only (performance.memory); numbers from a headless browser are a
 * regression signal, not a statement about real devices.
 */
const { chromium } = require('playwright');
const ROUNDS = Number(process.argv[2] || 300);
(async () => {
  const browser = await chromium.launch({ args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
  const p = await browser.newPage({ viewport: { width: 393, height: 852 } });
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto((process.env.TLS_URL || 'http://localhost:4173/') + '?seed=424242&fast=30&balance=100000000');
  await p.waitForFunction(() => window.__tls, null, { timeout: 30000 });
  const sample = async (i) => {
    await p.evaluate(() => { if (window.gc) window.gc(); });
    const s = await p.evaluate(() => { const st = window.__tls.state(); return { heap: performance.memory ? performance.memory.usedJSHeapSize : 0, objects: st.objects, tweens: st.tweens, mism: st.mismatches, dist: st.distortion }; });
    console.log(`round ${String(i).padStart(4)}  heap ${(s.heap / 1048576).toFixed(1)} MB  objects ${s.objects}  tweens ${s.tweens}`);
    return s;
  };
  const samples = [];
  for (let i = 0; i < ROUNDS; i++) {
    if (i % Math.ceil(ROUNDS / 6) === 0) samples.push(await sample(i));
    await p.evaluate((k) => window.__tls[k](), i % 10 === 9 ? 'buy' : 'spin');
    for (;;) {
      await p.waitForFunction(() => !window.__tls.state().busy || window.__tls.state().modal, null, { timeout: 180000 });
      const s = await p.evaluate(() => window.__tls.state());
      if (!s.busy) break;
      for (const d of s.doors) await p.mouse.click(d.x, d.y);
      await p.waitForTimeout(120);
    }
  }
  samples.push(await sample(ROUNDS));
  const first = samples[1] ?? samples[0], last = samples[samples.length - 1];
  const problems = [...errors];
  // Idle object and tween counts must return to the level after warm-up; the heap may grow a little (history, caches).
  if (last.objects > first.objects + 6) problems.push(`display objects grew from ${first.objects} to ${last.objects}`);
  if (last.tweens > first.tweens + 4) problems.push(`running tweens grew from ${first.tweens} to ${last.tweens}`);
  if (last.heap > first.heap * 1.5 + 8 * 1048576) problems.push(`heap grew from ${(first.heap / 1048576).toFixed(1)} to ${(last.heap / 1048576).toFixed(1)} MB`);
  if (last.mism !== 0 || last.dist > 0.001) problems.push('grid mismatch or distortion');
  await browser.close();
  if (problems.length) { console.error('FAILED\n' + problems.join('\n')); process.exit(1); }
  console.log(`OK  ${ROUNDS} rounds`);
})();
