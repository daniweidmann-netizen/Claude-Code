import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { DPR, REDUCED_MOTION } from '../env.js';
import type { Fx } from '../fx.js';
import { t, type TextKey } from '../i18n.js';
import { formatMoney, formatMultiple } from '../layout.js';
import { COLOR, DEPTH, DISPLAY, TEXT } from '../theme.js';

export interface PrizeInfo { kind: string; /** centibet */ value: number }

const DOORS: { key: string; name: TextKey; color: number }[] = [
  { key: 'door_sun', name: 'chamberSun', color: 0xffd76a },
  { key: 'door_jade', name: 'chamberJade', color: 0x3fae7c },
  { key: 'door_moon', name: 'chamberMoon', color: 0x39c6c0 },
];

interface Chamber {
  door: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
  name: Phaser.GameObjects.Text;
  prize: Phaser.GameObjects.Image | null;
  line1: Phaser.GameObjects.Text;
  line2: Phaser.GameObjects.Text;
  x: number; y: number; w: number; h: number; color: number; opened: boolean;
}

/**
 * Temple Bonus as its own scene: three chambers with their own identity.
 * The view only shows what the event log reports. A closed chamber's content
 * is unknown to the client until the engine reveals it, and the rule text
 * stays on screen while the player chooses.
 */
export class BonusView {
  private readonly layer: Phaser.GameObjects.Container;
  private readonly bg: Phaser.GameObjects.Image | null;
  private readonly dim: Phaser.GameObjects.Rectangle;
  private readonly title: Phaser.GameObjects.Text;
  private readonly hint: Phaser.GameObjects.Text;
  private chambers: Chamber[] = [];
  private onPick: ((i: number) => void) | null = null;
  private bet = 100;

  constructor(private readonly scene: Phaser.Scene, private readonly fx: Fx) {
    this.layer = scene.add.container(0, 0).setDepth(DEPTH.scene).setVisible(false);
    this.bg = scene.textures.exists('bgfs_portrait') ? scene.add.image(0, 0, 'bgfs_portrait') : null;
    this.dim = scene.add.rectangle(0, 0, 10, 10, 0x05070c, this.bg ? 0.62 : 0.94).setOrigin(0).setInteractive();
    this.title = scene.add.text(0, 0, '', { fontFamily: DISPLAY, color: COLOR.win, align: 'center' }).setOrigin(0.5);
    this.hint = scene.add.text(0, 0, '', { fontFamily: TEXT, color: COLOR.text, align: 'center' }).setOrigin(0.5, 0);
    if (this.bg) this.layer.add(this.bg);
    this.layer.add([this.dim, this.title, this.hint]);
  }

  get open(): boolean { return this.layer.visible; }

  /** Centres of the chambers in canvas pixels (for end-to-end tests). */
  doorPoints(): { x: number; y: number }[] { return this.chambers.map((c) => ({ x: c.x, y: c.y })); }

  show(title: string, count: number, bet: number): void {
    this.clear();
    this.bet = bet;
    const { width: w, height: h } = this.scene.scale;
    const portrait = h >= w, u = Math.min(w, h) / 390;
    if (this.bg) {
      this.bg.setTexture(portrait ? 'bgfs_portrait' : 'bgfs_landscape');
      this.bg.setPosition(w / 2, h / 2).setScale(Math.max(w / this.bg.width, h / this.bg.height));
    }
    this.dim.setSize(w, h);
    this.title.setText(title).setFontSize(`${Math.round(26 * u)}px`).setPosition(w / 2, h * (portrait ? 0.13 : 0.1));
    this.hint.setText(t('bonusHint')).setFontSize(`${Math.round(14.5 * u)}px`).setWordWrapWidth(Math.min(w * 0.86, 560 * u)).setColor(COLOR.text)
      .setPosition(w / 2, this.title.y + this.title.height / 2 + 8 * u);
    const gap = 10 * u;
    const dw = Math.min((w * 0.94 - gap * (count - 1)) / count, (h * (portrait ? 0.4 : 0.5)) * 0.75), dh = dw / 0.75;
    const cy = h * (portrait ? 0.5 : 0.56);
    for (let i = 0; i < count; i++) {
      const def = DOORS[i % DOORS.length];
      const x = w / 2 + (i - (count - 1) / 2) * (dw + gap);
      const door = this.scene.textures.exists(def.key)
        ? this.scene.add.image(x, cy, def.key).setDisplaySize(dw, dh)
        : this.scene.add.rectangle(x, cy, dw, dh, COLOR.stoneLight).setStrokeStyle(2 * DPR, def.color);
      door.setInteractive({ useHandCursor: true }).on('pointerup', () => this.onPick?.(i));
      const name = this.scene.add.text(x, cy + dh / 2 + 6 * u, t(def.name), { fontFamily: DISPLAY, fontSize: `${Math.round(11 * u)}px`, color: `#${def.color.toString(16).padStart(6, '0')}`, align: 'center' }).setOrigin(0.5, 0);
      const line1 = this.scene.add.text(x, cy, '', { fontFamily: DISPLAY, fontSize: `${Math.round(13 * u)}px`, color: COLOR.win, align: 'center' }).setOrigin(0.5).setAlpha(0);
      const line2 = this.scene.add.text(x, cy, '', { fontFamily: TEXT, fontSize: `${Math.round(12.5 * u)}px`, color: COLOR.text, align: 'center' }).setOrigin(0.5, 0).setAlpha(0);
      this.layer.add([door, name, line1, line2]);
      this.chambers.push({ door, name, prize: null, line1, line2, x, y: cy, w: dw, h: dh, color: def.color, opened: false });
    }
    this.layer.setVisible(true).setAlpha(0);
    this.scene.tweens.add({ targets: this.layer, alpha: 1, duration: 260 });
    if (!REDUCED_MOTION) {
      this.chambers.forEach((c, i) => {
        const base = c.door.scale;
        c.door.setScale(base * 0.9);
        this.scene.tweens.add({ targets: c.door, scale: base, duration: 320, delay: 120 + i * 90, ease: 'Back.easeOut' });
      });
    }
  }

  /** Waits until the player opens one of the available chambers. */
  waitPick(available: number[], again: boolean): Promise<number> {
    if (again) this.hint.setText(t('bonusAgain')).setColor(COLOR.win);
    this.chambers.forEach((c, i) => { if (!c.opened) c.door.setAlpha(available.includes(i) ? 1 : 0.5); });
    return new Promise((resolve) => {
      this.onPick = (i) => {
        if (!available.includes(i)) return;
        this.onPick = null;
        resolve(i);
      };
    });
  }

  private prizeTexts(p: PrizeInfo): { title: string; value: string; money: string; image: string } {
    const money = formatMoney((p.value / 10) * (this.bet / 10));
    switch (p.kind) {
      case 'freeSpins': return { title: t('prizeFs'), value: '', money: '', image: 'sym6' };
      case 'relic': return { title: t('prizeRelic'), value: formatMultiple(p.value), money: `${money}\n${t('prizeRelicMore')}`, image: 'station4' };
      case 'grand': return { title: t('prizeGrand'), value: formatMultiple(p.value), money, image: 'treasure' };
      default: return { title: t('prizeTreasure'), value: formatMultiple(p.value), money, image: 'treasure' };
    }
  }

  /** Opens a chamber and presents its content; unchosen chambers are shown truthfully but subdued. */
  async reveal(index: number, prize: PrizeInfo, chosen: boolean): Promise<void> {
    const c = this.chambers[index];
    if (!c || c.opened) return;
    c.opened = true;
    const tx = this.prizeTexts(prize);
    c.door.disableInteractive();
    if (chosen) {
      this.fx.flash(c.x, c.y, c.color, c.w * 1.3, 520);
      this.fx.burst(c.x, c.y, c.color, 26);
      if (!REDUCED_MOTION) await tween(this.scene, { targets: c.door, x: c.x + c.w * 0.025, duration: 45, yoyo: true, repeat: 3 });
    }
    await tween(this.scene, { targets: c.door, alpha: chosen ? 0.22 : 0.14, duration: chosen ? 300 : 180 });
    const key = this.scene.textures.exists(tx.image) ? tx.image : null;
    const size = c.w * (chosen ? 0.74 : 0.46);
    if (key) {
      c.prize = this.scene.add.image(c.x, c.y - c.h * 0.22, key).setDisplaySize(size, size).setAlpha(0);
      if (!chosen) c.prize.setTint(0x8a8f9c);
      this.layer.add(c.prize);
    }
    c.line1.setText(tx.value ? `${tx.title}\n${tx.value}` : tx.title).setPosition(c.x, c.y + c.h * 0.14).setColor(chosen ? COLOR.win : COLOR.dim);
    c.line2.setText(chosen ? tx.money : `${tx.money ? tx.money.split('\n')[0] + '\n' : ''}(${t('notChosen')})`)
      .setPosition(c.x, c.line1.y + c.line1.height / 2 + 2 * DPR).setColor(chosen ? COLOR.text : COLOR.dim).setWordWrapWidth(c.w);
    const targets = [c.line1, c.line2, ...(c.prize ? [c.prize] : [])];
    if (chosen && c.prize && !REDUCED_MOTION) {
      const s = c.prize.scale;
      c.prize.setScale(s * 0.6);
      this.scene.tweens.add({ targets: c.prize, scale: s, duration: 320, ease: 'Back.easeOut' });
    }
    await tween(this.scene, { targets, alpha: chosen ? 1 : 0.85, duration: chosen ? 260 : 180 });
    if (chosen) { this.fx.burst(c.x, c.y - c.h * 0.16, COLOR.goldBright, 18); await wait(this.scene, 500); }
  }

  /** Shows the remaining chambers after the choice is final. */
  async revealRest(list: { chamber: number; prize: PrizeInfo }[]): Promise<void> {
    if (list.length) this.hint.setText(t('bonusRevealed')).setColor(COLOR.dim);
    for (const p of list) await this.reveal(p.chamber, p.prize, false);
    await wait(this.scene, 1500);
  }

  async close(): Promise<void> {
    if (!this.layer.visible) return;
    this.onPick = null;
    await tween(this.scene, { targets: this.layer, alpha: 0, duration: 220 });
    this.layer.setVisible(false);
    this.clear();
  }

  private clear(): void {
    for (const c of this.chambers) { c.door.destroy(); c.name.destroy(); c.prize?.destroy(); c.line1.destroy(); c.line2.destroy(); }
    this.chambers = [];
  }
}
