import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { countUp } from './overlays.js';
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
  x: number; y: number; w: number; h: number; color: number; opened: boolean; key: string;
  openDoor?: Phaser.GameObjects.Image;
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
    this.title.setText(title).setFontSize(`${Math.round(26 * u)}px`).setPosition(w / 2, h * (portrait ? 0.075 : 0.08));
    this.hint.setText(t('bonusHint')).setFontSize(`${Math.round(14.5 * u)}px`).setWordWrapWidth(Math.min(w * 0.86, 560 * u)).setColor(COLOR.text)
      .setPosition(w / 2, this.title.y + this.title.height / 2 + 8 * u);
    // Portrait: two chambers above, one below, so each door is large; landscape: a row of three.
    const top = this.hint.y + this.hint.height + 14 * u, bottomEdge = h - 18 * u;
    const pos: { x: number; y: number }[] = [];
    let dw: number, dh: number;
    const ratio = 0.76, nameH = 22 * u;
    if (portrait && count === 3) {
      dw = Math.min(w * 0.46, ((bottomEdge - top - 2 * nameH - 10 * u) / 2) * ratio); dh = dw / ratio;
      const r1 = top + dh / 2, r2 = r1 + dh + nameH + 10 * u;
      pos.push({ x: w / 2 - dw * 0.54, y: r1 }, { x: w / 2 + dw * 0.54, y: r1 }, { x: w / 2, y: r2 });
    } else {
      const gap = 12 * u;
      dw = Math.min((w * 0.94 - gap * (count - 1)) / count, (bottomEdge - top - nameH) * ratio); dh = dw / ratio;
      const cy = top + (bottomEdge - top - nameH) / 2;
      for (let i = 0; i < count; i++) pos.push({ x: w / 2 + (i - (count - 1) / 2) * (dw + gap), y: cy });
    }
    for (let i = 0; i < count; i++) {
      const def = DOORS[i % DOORS.length];
      const { x, y: cy } = pos[i];
      const door = this.scene.textures.exists(def.key)
        ? this.scene.add.image(x, cy, def.key).setDisplaySize(dw, dh)
        : this.scene.add.rectangle(x, cy, dw, dh, COLOR.stoneLight).setStrokeStyle(2 * DPR, def.color);
      door.setInteractive({ useHandCursor: true }).on('pointerup', () => this.onPick?.(i));
      const name = this.scene.add.text(x, cy + dh / 2 + 3 * u, t(def.name), { fontFamily: DISPLAY, fontSize: `${Math.round(11.5 * u)}px`, color: `#${def.color.toString(16).padStart(6, '0')}`, align: 'center' }).setOrigin(0.5, 0);
      const line1 = this.scene.add.text(x, cy, '', { fontFamily: DISPLAY, fontSize: `${Math.round(15 * u)}px`, color: COLOR.win, align: 'center', stroke: '#05070c', strokeThickness: 4 * DPR }).setOrigin(0.5).setAlpha(0);
      const line2 = this.scene.add.text(x, cy, '', { fontFamily: TEXT, fontSize: `${Math.round(14 * u)}px`, color: COLOR.text, align: 'center', stroke: '#05070c', strokeThickness: 3 * DPR }).setOrigin(0.5, 0).setAlpha(0);
      this.layer.add([door, name, line1, line2]);
      this.chambers.push({ door, name, prize: null, line1, line2, x, y: cy, w: dw, h: dh, color: def.color, opened: false, key: def.key });
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
    // Torch-like breathing on the doors that can be chosen.
    if (!REDUCED_MOTION) this.chambers.forEach((c, i) => { if (!c.opened && available.includes(i)) this.fx.flash(c.x, c.y, c.color, c.w * 0.7, 700); });
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
    const openKey = `${c.key}_open`;
    const hasOpen = this.scene.textures.exists(openKey) && c.door instanceof Phaser.GameObjects.Image;
    if (chosen) {
      this.fx.flash(c.x, c.y, c.color, c.w * 0.9, 420);
      if (!REDUCED_MOTION) await tween(this.scene, { targets: c.door, x: c.x + c.w * 0.02, duration: 45, yoyo: true, repeat: 3 });
    }
    if (hasOpen) {
      // The open door has the same canvas as the closed one, so the wings appear to swing open in place.
      const open = this.scene.add.image(c.x, c.y, openKey).setDisplaySize(c.w, c.h).setAlpha(0);
      if (!chosen) open.setTint(0x7c8290);
      this.layer.addAt(open, this.layer.getIndex(c.door) + 1);
      c.openDoor = open;
      await Promise.all([
        tween(this.scene, { targets: open, alpha: chosen ? 1 : 0.8, duration: chosen ? 380 : 220 }),
        tween(this.scene, { targets: c.door, alpha: 0, duration: chosen ? 380 : 220 }),
      ]);
      if (chosen) {
        // Light floods out of the chamber.
        this.fx.raysBrief(c.x, c.y + c.h * 0.05, c.w * 1.5, c.color, 900);
        this.fx.ring(c.x, c.y, c.color, c.w * 0.2, c.w * 1.1, 600);
        this.fx.burst(c.x, c.y + c.h * 0.1, c.color, 30);
      }
    } else {
      await tween(this.scene, { targets: c.door, alpha: chosen ? 0.22 : 0.14, duration: chosen ? 300 : 180 });
    }
    const key = this.scene.textures.exists(tx.image) ? tx.image : null;
    const size = c.w * (chosen ? 0.54 : 0.4);
    const restY = c.y - c.h * 0.1;
    if (key) {
      c.prize = this.scene.add.image(c.x, restY + (chosen && !REDUCED_MOTION ? c.h * 0.16 : 0), key).setDisplaySize(size, size).setAlpha(0);
      if (!chosen) c.prize.setTint(0x8a8f9c);
      this.layer.add(c.prize);
    }
    this.layer.bringToTop(c.line1); this.layer.bringToTop(c.line2);
    c.line1.setText(tx.value ? `${tx.title}\n${tx.value}` : tx.title).setColor(chosen ? COLOR.win : COLOR.dim);
    c.line1.setPosition(c.x, c.y + c.h * 0.2);
    const moneyFirst = tx.money ? tx.money.split('\n')[0] : '';
    const rest = tx.money.includes('\n') ? '\n' + tx.money.split('\n').slice(1).join('\n') : '';
    c.line2.setText(chosen ? tx.money : `${moneyFirst ? moneyFirst + '\n' : ''}(${t('notChosen')})`)
      .setPosition(c.x, c.line1.y + c.line1.height / 2 + 2 * DPR).setOrigin(0.5, 0).setColor(chosen ? '#fff6d6' : COLOR.dim).setWordWrapWidth(c.w * 1.05);
    const targets = [c.line1, c.line2, ...(c.prize ? [c.prize] : [])];
    if (chosen && c.prize && !REDUCED_MOTION) this.scene.tweens.add({ targets: c.prize, y: restY, duration: 520, ease: 'Cubic.easeOut' });
    await tween(this.scene, { targets, alpha: chosen ? 1 : 0.9, duration: chosen ? 300 : 180 });
    if (chosen) {
      // The amount counts up; the final text is exactly the prize from the event.
      const total = Math.round((prize.value / 10) * (this.bet / 10));
      if (moneyFirst && !REDUCED_MOTION) {
        await countUp(this.scene, total, 700, (v) => c.line2.setText(formatMoney(Math.floor(v)) + rest));
        c.line2.setText(tx.money);
      }
      this.fx.burst(c.x, restY, COLOR.goldBright, 18);
      await wait(this.scene, 550);
    }
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
    for (const c of this.chambers) { c.door.destroy(); c.openDoor?.destroy(); c.name.destroy(); c.prize?.destroy(); c.line1.destroy(); c.line2.destroy(); }
    this.chambers = [];
  }
}
