/**
 * Measures real presentation times of free spins in the three speed modes and
 * checks that pace never changes a result:  node tools/e2e/timing.cjs
 * (preview server on port 4173). Times come from a headless browser at phone
 * size; they show the designed pace, not the frame rate of a real device.
 */
const { chromium } = require('playwright');
const URL = process.env.TLS_URL || 'http://localhost:4173/';
const SEEDS = [7, 21, 40];

async function playBought(p) {
  await p.evaluate(() => window.__tls.buy());
  for (;;) {
    await p.waitForFunction(() => !window.__tls.state().busy || window.__tls.state().modal, null, { timeout: 300000 });
    const s = await p.evaluate(() => window.__tls.state());
    if (!s.busy) return s;
    for (const d of s.doors) await p.mouse.click(d.x, d.y);
    await p.waitForTimeout(200);
  }
}
const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);

(async () => {
  const browser = await chromium.launch();
  const problems = [];
  const wins = {};
  const rows = [];
  for (const [device, w, h] of [['phone 393x852', 393, 852], ['desktop 1280x720', 1280, 720]]) {
    for (const mode of ['normal', 'fast', 'skip']) {
      const all = [];
      let outro = [];
      for (const seed of device.startsWith('phone') ? SEEDS : SEEDS.slice(0, 1)) {
        const p = await browser.newPage({ viewport: { width: w, height: h } });
        p.on('pageerror', (e) => problems.push(`${device} ${mode} ${seed}: ${e.message}`));
        p.on('console', (m) => { if (m.type() === 'error') problems.push(`${device} ${mode} ${seed}: ${m.text()}`); });
        await p.goto(`${URL}?seed=${seed}&speed=${mode}&balance=10000000`);
        await p.waitForFunction(() => window.__tls, null, { timeout: 30000 });
        const t0 = Date.now();
        const s = await playBought(p);
        const total = Date.now() - t0;
        const h0 = s.history[0];
        const key = `${seed}`;
        if (wins[key] === undefined) wins[key] = h0.win; else if (wins[key] !== h0.win) problems.push(`seed ${seed}: win differs between modes (${wins[key]} vs ${h0.win})`);
        if (s.mismatches !== 0 || s.distortion > 0.001) problems.push(`${device} ${mode} ${seed}: view mismatch`);
        if (s.freeMode) problems.push(`${device} ${mode} ${seed}: still in free-spin scenery`);
        const free = s.spinLog.filter((x) => x.mode === 'free');
        const indices = free.map((x) => x.index);
        if (indices.some((v, i) => v !== i + 1)) problems.push(`${device} ${mode} ${seed}: free-spin counter sequence ${indices}`);
        all.push(...free.map((x) => ({ ...x, seed, total })));
        outro.push(s.outroMs);
        await p.close();
      }
      const noWin = all.filter((x) => x.cascades === 0).map((x) => x.ms);
      const one = all.filter((x) => x.cascades === 1).map((x) => x.ms);
      const multi = all.filter((x) => x.cascades >= 2).map((x) => x.ms);
      const first8 = all.filter((x) => x.index <= 8);
      const perFeature = {};
      first8.forEach((x) => { perFeature[x.seed] = (perFeature[x.seed] || 0) + x.ms; });
      rows.push({ device, mode, spins: all.length, noWin: avg(noWin), nNoWin: noWin.length, one: avg(one), nOne: one.length, multi: avg(multi), nMulti: multi.length,
        all: avg(all.map((x) => x.ms)), eight: avg(Object.values(perFeature)), outro: avg(outro) });
    }
  }

  // Switching modes in the middle of a feature must not change the result either.
  {
    const seed = SEEDS[0];
    const p = await browser.newPage({ viewport: { width: 393, height: 852 } });
    p.on('pageerror', (e) => problems.push(`switch: ${e.message}`));
    await p.goto(`${URL}?seed=${seed}&speed=normal&balance=10000000`);
    await p.waitForFunction(() => window.__tls, null, { timeout: 30000 });
    const btn = async (name) => { const b = (await p.evaluate(() => window.__tls.state())).buttons.find((x) => x.name === name); await p.mouse.click(b.x + b.w / 2, b.y + b.h / 2); };
    await p.evaluate(() => window.__tls.buy());
    const seen = [];
    for (const mode of ['fast', 'skip', 'normal', 'skip', 'fast']) {
      await p.waitForTimeout(1300);
      await btn(`speed-${mode}`);
      await p.waitForTimeout(120);
      seen.push((await p.evaluate(() => window.__tls.state())).speedMode);
    }
    if (seen.join() !== 'fast,skip,normal,skip,fast') problems.push(`mode switch not applied: ${seen}`);
    for (;;) {
      await p.waitForFunction(() => !window.__tls.state().busy || window.__tls.state().modal, null, { timeout: 300000 });
      const s = await p.evaluate(() => window.__tls.state());
      if (!s.busy) break;
      for (const d of s.doors) await p.mouse.click(d.x, d.y);
      await p.waitForTimeout(200);
    }
    const s = await p.evaluate(() => window.__tls.state());
    if (s.history[0].win !== wins[`${seed}`]) problems.push(`switching modes changed the win: ${s.history[0].win} vs ${wins[`${seed}`]}`);
    if (s.history.length !== 1 || s.rounds !== 1) problems.push(`switching modes started extra rounds: ${s.rounds}`);
    if (s.mismatches !== 0) problems.push('switching modes: view mismatch');
    // Tapping the sun disc repeatedly while a round runs must not start a second round.
    const spin = s.buttons.find((x) => x.name === 'spin');
    await p.evaluate(() => window.__tls.spin());
    for (let i = 0; i < 6; i++) { await p.mouse.click(spin.x + spin.w / 2, spin.y + spin.h / 2); await p.waitForTimeout(60); }
    await p.waitForFunction(() => !window.__tls.state().busy || window.__tls.state().modal, null, { timeout: 120000 });
    const after = await p.evaluate(() => window.__tls.state());
    if (!after.modal && after.rounds !== 2) problems.push(`repeated taps: ${after.rounds} rounds instead of 2`);
    await p.close();
  }
  await browser.close();

  console.log('| Device | Mode | Free spins | No win (avg ms) | One cascade | Two or more | All spins | First 8 spins of a feature | Summary and return |');
  console.log('|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.device} | ${r.mode} | ${r.spins} | ${r.noWin} (${r.nNoWin}) | ${r.one} (${r.nOne}) | ${r.multi} (${r.nMulti}) | ${r.all} | ${(r.eight / 1000).toFixed(1)} s | ${(r.outro / 1000).toFixed(1)} s |`);
  console.log('wins by seed (minor units, identical in all modes):', JSON.stringify(wins));
  if (problems.length) { console.error('FAILED\n' + problems.join('\n')); process.exit(1); }
  console.log('OK');
})();
