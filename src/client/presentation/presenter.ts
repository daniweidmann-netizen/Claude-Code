import type Phaser from 'phaser';
import type { GameConfig, GameEvent } from '../../engine/index.js';
import { wait } from '../anim.js';
import type { Sfx } from '../audio/sfx.js';
import type { Fx } from '../fx.js';
import { t } from '../i18n.js';
import { WIN_TIERS, formatMoney, winTier } from '../layout.js';
import { COLOR, STATION_COLOR, STATION_NAMES } from '../theme.js';
import { holdMs, type HoldName } from '../timing.js';
import type { BonusView } from '../views/bonus-view.js';
import type { GridView } from '../views/grid-view.js';
import type { Hud } from '../views/hud.js';
import type { Banner } from '../views/overlays.js';
import type { TrackView } from '../views/track-view.js';

export interface Views {
  grid: GridView; track: TrackView; hud: Hud; banner: Banner; bonus: BonusView; sfx: Sfx; fx: Fx;
  /** Switches the scenery between base game and free spins. */
  setMode(free: boolean): void;
  /** Returns the presentation to normal speed (a speed-up never carries into the Temple Bonus). */
  normalSpeed(): void;
  /** Current time scale of tweens and timers. */
  scale(): number;
  /** Slightly darker surroundings for the last two free spins, so the play field stands out. */
  setTension(on: boolean): void;
  /** Back to the player's chosen speed after a scene that ran at capped speed. */
  resumeSpeed(): void;
}

/**
 * Turns the event log into animations. It never computes an outcome: every
 * number shown comes from an event, and events are played strictly in order.
 * `mismatches` counts frames where the drawn grid differs from the grid in
 * the log; `distortion` is the largest symbol stretch seen. Both must stay 0.
 */
export class Presenter {
  mismatches = 0;
  distortion = 0;
  private win = 0;      // centibet, running total of the round
  private treasure = 1;
  private sun = 0;
  private fsTotal = 0;
  private fsWinStart = 0;
  private freeMode = false;
  private seals = 0;
  private bet = 100;
  private station = 0;
  private picksInBonus = 0;
  private bestMult = 1;
  private fsIndex = 0;
  /**
   * True between the start of a free spin and its first evaluation: the Base Camp
   * effects are already owned, so they are shown together and briefly instead of
   * being unlocked one after the other again.
   */
  private campPhase = false;
  private spinClock = 0;
  private spinWin = 0;
  private spinCascades = 0;
  /** Real durations of the spins shown, for the pacing report: milliseconds from spin start to the end of its last pause. */
  readonly spinLog: { mode: string; index: number; ms: number; win: number; cascades: number; stations: number }[] = [];
  /** Real duration of the last free-spin summary and return to the base game. */
  outroMs = 0;

  constructor(private readonly scene: Phaser.Scene, private readonly cfg: GameConfig, private readonly v: Views) {}

  beginRound(bet: number): void {
    this.bet = bet; this.win = 0; this.fsTotal = 0; this.treasure = 1; this.sun = 0; this.seals = 0; this.station = 0; this.bestMult = 1; this.fsIndex = 0;
    this.v.hud.setFreeSpinTension(false);
    this.v.setTension(false);
    this.v.hud.setFooterText(t('maxWinNote', { x: `${(this.cfg.maxWin / 100).toLocaleString('en-US')}×` }));
    this.v.hud.setWin(0);
    this.v.hud.setFreeSpins('');
    this.v.hud.setMultiplier(1, 0);
    this.v.track.setBaseCamp(0, false);
    this.v.track.setSeals(0, false);
    if (this.freeMode) { this.freeMode = false; this.v.setMode(false); }
  }

  /** A pause from the central pacing table; it keeps its real-time minimum at any speed. */
  private hold(name: HoldName): Promise<void> { return wait(this.scene, holdMs(name, this.v.scale())); }
  private get lastSpins(): boolean { return this.freeMode && this.fsTotal > 0 && this.fsIndex >= this.fsTotal - 1; }

  private money(centibet: number): number { return (centibet / 10) * (this.bet / 10); }
  private addWin(centibet: number): void {
    this.win = Math.min(this.cfg.maxWin, this.win + centibet);
    this.v.hud.setWin(this.money(this.win), true);
    if (this.freeMode) this.v.hud.setFooterText(t('featureWin', { v: formatMoney(this.money(this.win - this.fsWinStart)) }));
  }
  private check(grid: number[]): void {
    const shown = this.v.grid.snapshot();
    if (shown.length !== grid.length || shown.some((id, i) => id !== grid[i])) {
      this.mismatches++;
      console.error('Grid view differs from the event log', { shown, grid });
    }
    this.distortion = Math.max(this.distortion, this.v.grid.maxDistortion());
  }

  async play(events: GameEvent[]): Promise<void> {
    const { grid, track, hud, banner, bonus, sfx, fx } = this.v;
    for (const e of events) {
      switch (e.type) {
        case 'featureBought':
          await banner.show(t('bought'), 450);
          break;
        case 'spinStarted':
          this.treasure = 1; this.sun = e.sunBonus; this.station = e.station;
          track.reset(e.station, e.steps);
          hud.setMultiplier(this.treasure, this.sun);
          this.spinClock = performance.now(); this.spinWin = 0; this.spinCascades = 0;
          this.campPhase = e.mode === 'free' && e.station > 0;
          if (e.mode === 'free') {
            this.fsIndex = e.freeSpinIndex;
            hud.setFreeSpins(t('freeSpinOf', { i: e.freeSpinIndex, n: this.fsTotal }));
            hud.setFreeSpinTension(this.lastSpins);
            this.v.setTension(this.lastSpins);
            hud.pulseFreeSpins();
            track.setBaseCamp(e.station, true);
            track.setSeals(this.seals, true);
            if (this.lastSpins) { sfx.play('step', 4); await this.hold('lastSpins'); }
            await this.hold('freeSpinStart');
          }
          break;
        case 'gridFilled':
          sfx.play('spin');
          await grid.fill(e.grid); this.check(e.grid);
          sfx.play('land');
          await this.hold('afterLanding');
          break;
        case 'gridCascaded':
          if (this.campPhase) { this.campPhase = false; await this.hold('campEffects'); }
          await grid.cascade(e.grid); this.check(e.grid);
          break;
        case 'clustersWon':
          hud.setMultiplier(this.treasure, this.sun);
          if (this.freeMode && e.multiplier > this.bestMult) this.bestMult = e.multiplier;
          sfx.play('win', Math.min(5, Math.floor(Math.log2(1 + e.win / 100))));
          await grid.showWin(e.clusters.map((c) => ({ symbol: c.symbol, cells: c.cells, label: `+${formatMoney(this.money(c.win))}` })));
          this.addWin(e.win);
          this.spinWin += e.win; this.spinCascades++;
          await this.hold('afterWin');
          break;
        case 'keysCollected': {
          track.announce(t('fxKey'), Math.min(5, this.station + 1), 900);
          const target = track.worldOf(Math.min(5, this.station + 1));
          await Promise.all([grid.highlight(e.positions, 0xb07cff), ...e.positions.map((p) => fx.fly(grid.center(p), target, 0xb07cff, 300))]);
          if (this.fsTotal > 0) track.setBaseCamp(e.baseCamp, true);
          break;
        }
        case 'trackAdvanced':
          if (e.to > e.from) sfx.play('station', e.to); else sfx.play('step', e.to);
          await track.advance(e.to, e.steps);
          // A newly reached station gets its moment before the game moves on.
          if (e.to > e.from) await this.hold('stationUnlocked');
          this.station = e.to;
          break;
        case 'symbolsRemoved':
          sfx.play('remove');
          await grid.clear(e.positions);
          break;
        case 'discovery':
          if (this.campPhase) { e.positions.forEach((p) => void fx.fly(track.worldOf(1), grid.center(p), STATION_COLOR[0], 320)); break; }
          track.announce(t('fxDiscovery'), 1);
          await Promise.all([this.hold('stationEffect'), ...e.positions.map((p) => fx.fly(track.worldOf(1), grid.center(p), STATION_COLOR[0], 320))]);
          break;
        case 'treasure':
          this.treasure = e.multiplier;
          if (this.campPhase) { void fx.fly(track.worldOf(2), hud.multiplierPoint, STATION_COLOR[1], 300); hud.setMultiplier(this.treasure, this.sun); break; }
          track.announce(t('fxTreasure', { m: e.multiplier }), 2);
          await fx.fly(track.worldOf(2), hud.multiplierPoint, STATION_COLOR[1], 300);
          hud.setMultiplier(this.treasure, this.sun);
          await this.hold('stationEffect');
          break;
        case 'ancientPower':
          if (this.campPhase) { if (e.position >= 0) void fx.fly(track.worldOf(3), grid.center(e.position), STATION_COLOR[2], 340); break; }
          track.announce(t('fxAncient'), 3);
          await Promise.all([this.hold('stationEffect'), e.position >= 0 ? fx.fly(track.worldOf(3), grid.center(e.position), STATION_COLOR[2], 340) : Promise.resolve()]);
          break;
        case 'relic':
          sfx.play('relic');
          track.announce(t('fxRelic', { v: e.value }), 4);
          await fx.fly(track.worldOf(4), grid.center(e.position), STATION_COLOR[3], 280);
          await grid.showRelic(e.position, e.value);
          await fx.fly(grid.center(e.position), hud.multiplierPoint, COLOR.goldBright, 300);
          this.sun = e.sunBonus;
          hud.setMultiplier(this.treasure, this.sun);
          await this.hold('stationEffect');
          break;
        case 'templeReached':
          if (e.mode === 'free') {
            this.seals = e.seals;
            track.setSeals(this.seals, true);
            track.announce(t('fxSeal', { n: e.seals }), 5);
            await this.hold('stationUnlocked');
          } else {
            // The biggest moment of the base game: a pause, then light from the temple across the play field.
            track.announce(t('fxTemple'), 5, 2200);
            const from = track.worldOf(5), mid = grid.middle;
            fx.raysBrief(from.x, from.y, Math.max(this.scene.scale.width, this.scene.scale.height) * 0.5, STATION_COLOR[4], 1100);
            await wait(this.scene, 380);
            await fx.fly(from, mid, STATION_COLOR[4], 420);
            fx.ring(mid.x, mid.y, STATION_COLOR[4], 20, Math.max(this.scene.scale.width, this.scene.scale.height) * 0.6, 800);
            await wait(this.scene, 420);
          }
          break;
        case 'spinEnded': {
          await this.hold(e.win > 0 ? 'spinEndWin' : 'spinEndNoWin');
          if (e.mode === 'free') {
            // The last two results stay a little longer; the very last one also gets the pause before the summary.
            if (this.lastSpins) await this.hold('lastSpins');
            await this.hold(this.fsIndex >= this.fsTotal ? 'beforeSummary' : 'betweenFreeSpins');
          }
          this.spinLog.push({ mode: e.mode, index: e.mode === 'free' ? this.fsIndex : 0, ms: Math.round(performance.now() - this.spinClock), win: this.spinWin, cascades: this.spinCascades, stations: this.station });
          if (this.spinLog.length > 200) this.spinLog.shift();
          break;
        }
        case 'freeSpinsAwarded': {
          const first = this.fsTotal === 0;
          sfx.play(first ? 'freeSpins' : 'retrigger');
          this.fsTotal = e.total;
          if (first) {
            this.fsWinStart = this.win;
            await grid.highlight(grid.cellsOf(6), COLOR.goldBright);
            // Change of scenery: into the temple.
            await banner.wipe(0xffe9a8, () => { this.freeMode = true; this.v.setMode(true); hud.setFreeSpins(`${t('freeSpins')} ${e.total}`); track.setBaseCamp(e.baseCamp, true); track.setSeals(0, true); });
            await banner.feature('gate', t('fsAward', { n: e.spins }), [
              ...(e.baseCamp > 0 ? [t('fsCamp', { name: STATION_NAMES[e.baseCamp - 1] })] : []),
              t('fsKept'),
            ], 1500);
          } else {
            await grid.highlight(grid.cellsOf(6), COLOR.goldBright);
            hud.setFreeSpins(t('freeSpinOf', { i: this.fsIndex, n: this.fsTotal }));
            hud.setFreeSpinTension(this.lastSpins);
            hud.pulseFreeSpins();
            await banner.show(t('fsRetrigger', { n: e.spins }), 900);
          }
          break;
        }
        case 'templeBonusStarted':
          this.v.normalSpeed();
          sfx.play('bonus');
          this.picksInBonus = 0;
          // Into the temple: a wash of white-gold light, and the chamber scene stands behind it.
          await wait(this.scene, 500);
          await banner.wipe(0xfff1c4, () => bonus.show(
            e.tier === 'finale' ? `${t('finaleTitle')} · ${t(e.seals === 1 ? 'finaleSeals' : 'finaleSealsPl', { n: e.seals })}` : t('bonusTitle'),
            e.chambers, this.bet,
          ));
          break;
        case 'chamberPicked':
          this.v.normalSpeed();
          sfx.play('pick');
          this.picksInBonus++;
          await bonus.reveal(e.chamber, e.prize, true);
          if (e.prize.kind !== 'freeSpins') this.addWin(e.prize.value);
          await wait(this.scene, 600);
          break;
        case 'chambersRevealed':
          sfx.play('complete');
          await bonus.revealRest(e.prizes);
          await bonus.close();
          this.v.resumeSpeed();
          break;
        case 'maxWinReached':
          this.win = this.cfg.maxWin;
          hud.setWin(this.money(this.win));
          if (bonus.open) await bonus.close();
          sfx.play('bigWin', 3);
          await banner.celebrate(t('maxWin'), this.money(this.cfg.maxWin), 3);
          break;
        case 'roundEnded': {
          this.win = e.totalWin;
          hud.setWin(this.money(this.win));
          if (bonus.open) await bonus.close();
          const capped = e.totalWin >= this.cfg.maxWin;
          if (this.freeMode) {
            const outroStart = performance.now();
            hud.setFreeSpinTension(false);
            this.v.setTension(false);
            this.v.normalSpeed();
            // Summary of the feature, then back to the jungle.
            if (!capped) sfx.play('complete');
            if (!capped) await banner.celebrate(t('fsDone') + '\n' + t('totalWin'), this.money(e.totalWin - this.fsWinStart), 1, undefined,
              [t('fsPlayed', { n: this.fsIndex }), t('fsBest', { m: this.bestMult }), ...(this.seals > 0 ? [t('fsSeals', { n: this.seals })] : [])].join('  ·  ') + '\n' + t('fsBack'));
            await banner.wipe(0x0b0e16, () => {
              this.freeMode = false; this.v.setMode(false);
              hud.setFreeSpins(''); track.setBaseCamp(0, false); track.setSeals(0, false);
              track.reset(0, 0); this.sun = 0; this.treasure = 1; hud.setMultiplier(1, 0);
              hud.setFooterText(t('maxWinNote', { x: `${(this.cfg.maxWin / 100).toLocaleString('en-US')}×` }));
            });
            this.outroMs = Math.round(performance.now() - outroStart);
            this.v.resumeSpeed();
          }
          const tier = winTier(e.totalWin);
          if (tier > 0 && !capped) {
            sfx.play('bigWin', tier);
            await banner.celebrate(t(WIN_TIERS[tier - 1].key), this.money(e.totalWin), tier);
          }
          break;
        }
        case 'cascadeLimitReached':
          break;
      }
    }
  }

  /** True after the first pick of the current bonus (the next pick is a Relic follow-up). */
  get pickedInBonus(): boolean { return this.picksInBonus > 0; }
}
