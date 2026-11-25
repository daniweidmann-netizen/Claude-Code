/**
 * End-to-end smoke test of the built client (run `npm run build`, `npm run build:client` and
 * `npx vite preview --port 4173` first):  node tools/e2e/smoke.cjs [outDir]
 *
 * Plays normal and bought rounds through the real UI in portrait and
 * landscape, opens bonus chambers by clicking them, and checks that
 *  - no console or page error occurs, all art loads, the canvas renders at device resolution,
 *  - one run uses reduced motion (?motion=reduced),
 *  - the drawn grid always equals the grid in the event log (mismatches = 0),
 *  - no symbol is ever stretched (aspect ratio stays exact),
 *  - texts and buttons stay on screen, do not overlap and are large enough to touch,
 *  - the scenery returns to the base game after free spins,
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
    // A chamber pick is pending: click the chamber doors from left to right.
    for (const d of s.doors) await p.mouse.click(d.x, d.y);
    await p.waitForTimeout(150);
  }
}

(async () => {
  const browser = await chromium.launch();
  const problems = [];
  let picksSeen = 0;
  // name, CSS width, CSS height, device pixel ratio, extra query
  // Large canvases get short runs: headless Chromium renders in software, which is slow at high resolution.
  // SMOKE_QUICK=1: one phone format and three bonus rounds, for every change; the full run before hand-overs.
  const QUICK = !!process.env.SMOKE_QUICK;
  for (const [name, w, h, dsf, extra, rounds] of QUICK ? [['iphone15pro', 393, 852, 1, '', 16]] : [['iphone15pro', 393, 852, 1, '', 40], ['landscape', 1280, 720, 1, '', 9], ['small', 360, 640, 1, '&motion=reduced', 24], ['iphoneSE', 375, 667, 1, '&lang=de', 16], ['phoneLandscape', 852, 393, 1, '', 9], ['hidpi', 393, 852, 3, '', 4]]) {
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
    // Layout: every text and button lies inside the screen; texts do not run into buttons; touch targets are large enough.
    const boxes = (st) => [...st.texts.map((t) => ({ ...t, kind: 'text' })), ...st.buttons.map((b) => ({ ...b, kind: 'button' }))];
    const checkLayout = (st, where) => {
      const all = boxes(st);
      for (const a of all) {
        if (a.x < -0.5 || a.y < -0.5 || a.x + a.w > w + 0.5 || a.y + a.h > h + 0.5) problems.push(`${name} ${where}: ${a.name} outside the screen`);
        if (a.kind === 'button' && a.name !== 'spin' && Math.min(a.w, a.h) < 43.5) problems.push(`${name} ${where}: button ${a.name} is ${a.w.toFixed(0)}x${a.h.toFixed(0)} px`);
      }
      for (const t of st.texts) for (const b of st.buttons) {
        const hit = t.x < b.x + b.w - 1 && b.x < t.x + t.w - 1 && t.y < b.y + b.h - 1 && b.y < t.y + t.h - 1;
        if (hit) problems.push(`${name} ${where}: text "${t.text}" overlaps button ${b.name}`);
      }
    };
    checkLayout(env, 'idle');
    let balance = (await p.evaluate(() => window.__tls.state())).balance;
    for (let i = 0; i < rounds; i++) {
      const kind = i % 8 === (rounds < 8 ? 3 : 7) ? 'buy' : 'spin'; // every eighth round is a bought feature
      await p.evaluate((k) => window.__tls[k](), kind);
      if (kind === 'buy' && i === 7) {
        await p.waitForFunction(() => window.__tls.state().freeMode, null, { timeout: 120000 });
        await p.waitForTimeout(300);
        checkLayout(await p.evaluate(() => window.__tls.state()), 'free spins');
        if (out) await p.screenshot({ path: `${out}/${name}_freespins.png` });
      }
      await finishRound(p, w, h);
      const s = await p.evaluate(() => window.__tls.state());
      const last = s.history[0];
      balance += last.win - last.stake;
      picksSeen += last.picks.length;
      if (last.kind !== kind) problems.push(`${name}: round ${i} kind ${last.kind}`);
      if (s.balance !== balance) problems.push(`${name}: round ${i} balance ${s.balance} != ${balance}`);
      if (s.mismatches !== 0) problems.push(`${name}: round ${i} grid mismatches ${s.mismatches}`);
      if (s.distortion > 0.001) problems.push(`${name}: round ${i} symbol distortion ${s.distortion}`);
      if (s.freeMode) problems.push(`${name}: round ${i} still in free-spin scenery after the round`);
    }
    if (out) await p.screenshot({ path: `${out}/${name}_end.png` });
    // Audio: after the first click all 15 effects and both music loops must be loaded and decoded.
    await p.mouse.click(w / 2, h * 0.02);
    await p.waitForFunction(() => window.__tls.state().audioLoaded + window.__tls.state().audioFailed.length >= 17, null, { timeout: 60000 }).catch(() => undefined);
    const audio = await p.evaluate(() => window.__tls.state());
    if (audio.audioLoaded !== 17 || audio.audioFailed.length) problems.push(`${name}: audio loaded ${audio.audioLoaded}/17, failed: ${audio.audioFailed}`);

    // Autoplay: ten rounds, books still exact, controls return afterwards.
    const before = await p.evaluate(() => window.__tls.state().rounds);
    await p.evaluate(() => window.__tls.auto());
    for (;;) {
      await finishRound(p, w, h);
      const s = await p.evaluate(() => window.__tls.state());
      if (process.env.SMOKE_DEBUG) console.log(JSON.stringify({ busy: s.busy, auto: s.autoLeft, rounds: s.rounds, modal: s.modal, dialog: s.dialog, info: s.info, banner: await p.evaluate(() => window.__tls.banner()) }));
      if (s.autoLeft === 0 && !s.busy) break;
      await p.waitForTimeout(30);
    }
    const afterAuto = await p.evaluate(() => window.__tls.state());
    if (afterAuto.rounds - before !== 10) problems.push(`${name}: autoplay played ${afterAuto.rounds - before} rounds`);
    if (afterAuto.mismatches !== 0) problems.push(`${name}: grid mismatches after autoplay`);

    // Info panel through the real button: rules, paytable, history.
    const infoBtn = (await p.evaluate(() => window.__tls.state())).buttons.find((b) => b.name === 'info');
    await p.mouse.click(infoBtn.x + infoBtn.w / 2, infoBtn.y + infoBtn.h / 2);
    await p.waitForSelector('.tls-info.open', { timeout: 5000 }).catch(() => problems.push(`${name}: info panel did not open`));
    const rules = await p.locator('.tls-info main').innerText().catch(() => '');
    const de = extra.includes('lang=de');
    if (!rules.includes(de ? 'Nicht zertifiziert' : 'Not certified') || !rules.includes('Expedition Track')) problems.push(`${name}: rules text incomplete`);
    if (out) await p.screenshot({ path: `${out}/${name}_rules.png` });
    await p.getByRole('tab', { name: de ? 'Auszahlungen' : 'Paytable' }).click();
    if (await p.locator('.tls-info td').count() !== 40) problems.push(`${name}: paytable cells`);
    if (out) await p.screenshot({ path: `${out}/${name}_paytable.png` });
    await p.getByRole('tab', { name: de ? 'Verlauf' : 'History' }).click();
    if (await p.locator('.tls-info tbody tr').count() !== Math.min(50, rounds + 10)) problems.push(`${name}: history rows`);
    // Settings: the volume slider changes the stored volume.
    await p.getByRole('tab', { name: de ? 'Einstellungen' : 'Settings' }).click();
    await p.locator('#tls-volume').fill('30');
    if (Math.abs((await p.evaluate(() => window.__tls.state())).volume - 0.3) > 0.001) problems.push(`${name}: volume slider had no effect`);
    await p.locator('#tls-volume').fill('70');
    await p.getByRole('button', { name: de ? 'Schliessen' : 'Close' }).click();
    if (await p.locator('.tls-info.open').count() !== 0) problems.push(`${name}: info panel did not close`);
    console.log(name, 'rounds', rounds, 'balance', balance);
    await p.close();
  }

  // Temple Bonus and Temple Finale through the UI: seeds that are known to reach a chamber pick.
  const engine = await import('../../dist/src/engine/index.js');
  const tables = new engine.Tables(engine.CONFIG_V1);
  const seedsFor = (buy, count) => {
    const found = [];
    for (let s = 0; found.length < count; s++) {
      const r = new engine.Round(tables, engine.Xoshiro256.fromSeed(BigInt(s)));
      if (buy) r.startBought(); else r.start();
      if (r.awaitingPick) found.push(s);
    }
    return found;
  };
  let bonusRounds = 0;
  for (const [kind, seeds] of [['spin', seedsFor(false, QUICK ? 2 : 6)], ['buy', seedsFor(true, QUICK ? 1 : 3)]]) {
    for (const seed of seeds) {
      const w = 393, h = 852;
      const p = await browser.newPage({ viewport: { width: w, height: h } });
      p.on('console', (m) => { if (m.type() === 'error') problems.push(`bonus ${seed}: ${m.text()}`); });
      p.on('pageerror', (e) => problems.push(`bonus ${seed}: ${e.message}`));
      await p.goto(`${URL}?seed=${seed}&fast=25&balance=1000000`);
      await p.waitForFunction(() => window.__tls, null, { timeout: 20000 });
      const before = (await p.evaluate(() => window.__tls.state())).balance;
      await p.evaluate((k) => window.__tls[k](), kind);
      if (out && bonusRounds === 0) {
        await p.waitForFunction(() => window.__tls.state().modal, null, { timeout: 120000 });
        await p.waitForTimeout(200);
        await p.screenshot({ path: `${out}/bonus_chambers.png` });
      }
      await finishRound(p, w, h);
      const s = await p.evaluate(() => window.__tls.state());
      const last = s.history[0];
      if (last.picks.length === 0) problems.push(`bonus ${kind} seed ${seed}: no pick recorded`);
      if (s.balance !== before - last.stake + last.win) problems.push(`bonus ${kind} seed ${seed}: balance`);
      if (s.mismatches !== 0 || s.modal) problems.push(`bonus ${kind} seed ${seed}: view state`);
      picksSeen += last.picks.length;
      bonusRounds++;

      if (bonusRounds === 1) {
        // Replay of that round from the history: same presentation, balance untouched.
        const ib = s.buttons.find((b) => b.name === 'info');
        const openInfo = () => p.mouse.click(ib.x + ib.w / 2, ib.y + ib.h / 2);
        await openInfo();
        await p.getByRole('tab', { name: 'History' }).click();
        await p.getByRole('button', { name: 'Replay' }).first().click();
        await p.waitForFunction(() => window.__tls.state().replays === 1 && !window.__tls.state().busy, null, { timeout: 120000 });
        const r = await p.evaluate(() => window.__tls.state());
        if (r.balance !== s.balance || r.history.length !== s.history.length) problems.push('replay changed the balance or the history');
        if (r.mismatches !== 0 || r.modal) problems.push('replay: view state');
        // Performance tab renders and resets.
        await openInfo();
        await p.getByRole('tab', { name: 'Performance' }).click();
        if (!(await p.locator('.tls-info main').innerText()).includes('Frames per second')) problems.push('performance tab incomplete');
        await p.getByRole('button', { name: 'Reset measurement' }).click();
        if ((await p.evaluate(() => window.__tls.state())).perf.frames !== 0) problems.push('performance reset failed');
      }
      await p.close();
    }
  }
  console.log('bonus rounds through the UI:', bonusRounds);

  await browser.close();
  console.log('chamber picks made through the UI:', picksSeen);
  if (picksSeen === 0) problems.push('no Temple Bonus occurred; the pick path was not exercised');
  if (problems.length) { console.error('FAILED\n' + problems.join('\n')); process.exit(1); }
  console.log('OK');
})();
