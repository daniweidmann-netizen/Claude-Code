import type Phaser from 'phaser';
import type { GameConfig, GameEvent } from '../../engine/index.js';
import { wait } from '../anim.js';
import type { Sfx } from '../audio/sfx.js';
import { WIN_TIERS, formatMoney, winTier } from '../layout.js';
import type { GridView } from '../views/grid-view.js';
import type { Hud } from '../views/hud.js';
import { prizeLabel, type Banner, type Modal } from '../views/overlays.js';
import type { TrackView } from '../views/track-view.js';

export interface Views { grid: GridView; track: TrackView; hud: Hud; banner: Banner; modal: Modal; sfx: Sfx }

/**
 * Turns the event log into animations. It never computes an outcome: every
 * number shown comes from an event. `mismatches` counts frames where the
 * drawn grid differs from the grid in the log (must stay 0).
 */
export class Presenter {
  mismatches = 0;
  private win = 0;      // centibet, running total of the round
  private treasure = 1;
  private sun = 0;
  private fsTotal = 0;
  private bet = 100;

  constructor(private readonly scene: Phaser.Scene, private readonly cfg: GameConfig, private readonly v: Views) {}

  beginRound(bet: number): void {
    this.bet = bet; this.win = 0; this.fsTotal = 0; this.treasure = 1; this.sun = 0; this.seals = 0;
    this.v.hud.setWin(0);
    this.v.hud.setFreeSpins('');
    this.v.track.setBaseCamp(0, false);
    this.v.track.setSeals(0, false);
  }

  private money(centibet: number): number { return (centibet / 10) * (this.bet / 10); }
  private addWin(centibet: number): void {
    this.win = Math.min(this.cfg.maxWin, this.win + centibet);
    this.v.hud.setWin(this.money(this.win));
  }
  private check(grid: number[]): void {
    const shown = this.v.grid.snapshot();
    if (shown.length !== grid.length || shown.some((id, i) => id !== grid[i])) {
      this.mismatches++;
      console.error('Grid view differs from the event log', { shown, grid });
    }
  }

  async play(events: GameEvent[]): Promise<void> {
    const { grid, track, hud, banner, modal, sfx } = this.v;
    for (const e of events) {
      switch (e.type) {
        case 'featureBought':
          await banner.show('Expedition gekauft', 500);
          break;
        case 'spinStarted':
          this.treasure = 1; this.sun = e.sunBonus;
          track.reset(e.station);
          hud.setMultiplier(this.treasure + this.sun);
          if (e.mode === 'free') {
            hud.setFreeSpins(`Free Spin ${e.freeSpinIndex} / ${this.fsTotal}`);
            track.setBaseCamp(e.station, true);
            this.sealsShown();
          }
          break;
        case 'gridFilled':
          sfx.play('spin');
          await grid.fill(e.grid); this.check(e.grid);
          sfx.play('land');
          break;
        case 'gridCascaded':
          await grid.cascade(e.grid); this.check(e.grid);
          break;
        case 'clustersWon':
          hud.setMultiplier(e.multiplier);
          sfx.play('win', Math.min(5, Math.floor(Math.log2(1 + e.win / 100))));
          await grid.highlight([...new Set(e.clusters.flatMap((c) => c.cells))]);
          this.addWin(e.win);
          break;
        case 'keysCollected':
          await grid.highlight(e.positions);
          if (this.fsTotal > 0) track.setBaseCamp(e.baseCamp, true);
          break;
        case 'trackAdvanced':
          if (e.to > e.from) sfx.play('station', e.to); else sfx.play('step', e.to);
          await track.advance(e.to);
          break;
        case 'symbolsRemoved':
          sfx.play('remove');
          await grid.clear(e.positions);
          break;
        case 'discovery':
          await banner.show('Discovery\nWilds erscheinen', 380);
          break;
        case 'treasure':
          this.treasure = e.multiplier;
          hud.setMultiplier(this.treasure + this.sun);
          await banner.show(`Treasure\nMultiplikator ×${e.multiplier}`, 380);
          break;
        case 'ancientPower':
          await banner.show('Ancient Power\nder Explorer bleibt', 380);
          break;
        case 'relic':
          this.sun = e.sunBonus;
          sfx.play('relic');
          hud.setMultiplier(this.treasure + this.sun);
          await banner.show(`Sun Relic +${e.value}`, 420);
          break;
        case 'templeReached':
          if (e.mode === 'free') { this.seals = e.seals; this.sealsShown(); await banner.show('Tempelsiegel', 420); }
          else await banner.show('Der Tempel öffnet sich', 600);
          break;
        case 'spinEnded':
          await wait(this.scene, e.win > 0 ? 260 : 120);
          break;
        case 'freeSpinsAwarded':
          this.fsTotal = e.total;
          sfx.play('freeSpins');
          await banner.show(e.source === 'retrigger' ? `+${e.spins} Free Spins` : `${e.spins} Free Spins`, 700);
          break;
        case 'templeBonusStarted':
          sfx.play('bonus');
          modal.showChambers(
            e.tier === 'finale' ? `Temple Finale – ${e.seals} Siegel` : 'Temple Bonus',
            'Wähle eine Kammer. Die Preise liegen fest, bevor du wählst – deine Wahl entscheidet.',
            e.chambers,
          );
          break;
        case 'chamberPicked':
          sfx.play('pick');
          await modal.reveal(e.chamber, prizeLabel(e.prize.kind, e.prize.value, this.bet), true);
          if (e.prize.kind !== 'freeSpins') this.addWin(e.prize.value);
          await wait(this.scene, 500);
          break;
        case 'chambersRevealed':
          for (const p of e.prizes) await modal.reveal(p.chamber, prizeLabel(p.prize.kind, p.prize.value, this.bet), false);
          await wait(this.scene, 1400);
          modal.close();
          break;
        case 'maxWinReached':
          this.win = this.cfg.maxWin;
          hud.setWin(this.money(this.win));
          await banner.show(`MAXIMALGEWINN\n${formatMoney(this.money(this.cfg.maxWin))}`, 1500);
          break;
        case 'roundEnded': {
          this.win = e.totalWin;
          hud.setWin(this.money(this.win));
          if (modal.open) modal.close();
          const tier = winTier(e.totalWin);
          if (tier > 0) {
            sfx.play('bigWin', tier);
            await banner.celebrate(WIN_TIERS[tier - 1].title, this.money(e.totalWin), 900 + tier * 500);
          }
          break;
        }
        case 'cascadeLimitReached':
          break;
      }
    }
  }

  private seals = 0;
  private sealsShown(): void { this.v.track.setSeals(this.seals, this.fsTotal > 0); }
}
