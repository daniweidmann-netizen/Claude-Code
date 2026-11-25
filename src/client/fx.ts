import Phaser from 'phaser';
import { tween } from './anim.js';
import { DPR, REDUCED_MOTION } from './env.js';
import { DEPTH } from './theme.js';

/**
 * Light and particle effects with a budget. Level 2 = full, 1 = light,
 * 0 = none (reduced motion). The scene lowers the level when the measured
 * frame rate drops, so effects never cost playability. Pure decoration:
 * nothing here reads or changes game data.
 */
export class Fx {
  level: 0 | 1 | 2 = REDUCED_MOTION ? 0 : 2;
  private readonly sparks: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly coins: Phaser.GameObjects.Particles.ParticleEmitter;
  private dust: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(private readonly scene: Phaser.Scene) {
    Fx.makeTextures(scene);
    this.sparks = scene.add.particles(0, 0, 'fx_spark', {
      speed: { min: 60 * DPR, max: 260 * DPR }, lifespan: { min: 260, max: 620 },
      scale: { start: 0.55 * DPR, end: 0 }, alpha: { start: 1, end: 0 },
      blendMode: 'ADD', emitting: false, maxAliveParticles: 220,
    }).setDepth(DEPTH.fx);
    this.coins = scene.add.particles(0, 0, 'fx_coin', {
      speedY: { min: 180 * DPR, max: 420 * DPR }, speedX: { min: -70 * DPR, max: 70 * DPR },
      lifespan: 1900, scale: { min: 0.35 * DPR, max: 0.75 * DPR }, rotate: { min: 0, max: 360 },
      alpha: { start: 1, end: 0.6 }, emitting: false, maxAliveParticles: 140,
    }).setDepth(DEPTH.celebrate - 1);
  }

  private static makeTextures(scene: Phaser.Scene): void {
    if (scene.textures.exists('fx_spark')) return;
    const dot = (key: string, size: number, stops: [number, string][]) => {
      const tex = scene.textures.createCanvas(key, size, size)!;
      const ctx = tex.getContext();
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      stops.forEach(([o, c]) => g.addColorStop(o, c));
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      tex.refresh();
    };
    dot('fx_spark', 32, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]);
    dot('fx_glow', 128, [[0, 'rgba(255,255,255,0.9)'], [0.4, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']]);
    dot('fx_shadow', 64, [[0, 'rgba(0,0,0,0.75)'], [0.6, 'rgba(0,0,0,0.3)'], [1, 'rgba(0,0,0,0)']]);
    dot('fx_coin', 24, [[0, 'rgba(255,240,170,1)'], [0.7, 'rgba(232,184,74,1)'], [0.86, 'rgba(138,106,30,1)'], [1, 'rgba(138,106,30,0)']]);
    // Sunburst for big wins: sixteen soft wedges.
    const size = 512, tex = scene.textures.createCanvas('fx_rays', size, size)!, ctx = tex.getContext();
    ctx.translate(size / 2, size / 2);
    for (let i = 0; i < 16; i++) {
      ctx.rotate(Math.PI / 8);
      const g = ctx.createLinearGradient(0, 0, 0, -size / 2);
      g.addColorStop(0, 'rgba(255,215,106,0.55)'); g.addColorStop(1, 'rgba(255,215,106,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-size * 0.05, -size / 2); ctx.lineTo(size * 0.05, -size / 2); ctx.closePath(); ctx.fill();
    }
    tex.refresh();
  }

  /** Short burst of sparks. */
  burst(x: number, y: number, color: number, count = 10): void {
    if (this.level === 0) return;
    this.sparks.setParticleTint(color);
    this.sparks.explode(Math.max(2, Math.round(count * (this.level === 2 ? 1 : 0.4))), x, y);
  }

  /** Soft flash of light that expands and fades. */
  flash(x: number, y: number, color: number, radius: number, ms = 320): void {
    if (this.level === 0) return;
    const g = this.scene.add.image(x, y, 'fx_glow').setTint(color).setBlendMode('ADD').setDepth(DEPTH.fx).setScale(0.2);
    this.scene.tweens.add({ targets: g, scale: (radius * 2) / 128, alpha: 0, duration: ms, ease: 'Cubic.easeOut', onComplete: () => g.destroy() });
  }

  /**
   * A beam of light travelling from one point to another (station to grid, key to track).
   * It leaves a short trail so the eye can follow where the effect comes from.
   */
  async fly(from: { x: number; y: number }, to: { x: number; y: number }, color: number, ms = 380): Promise<void> {
    if (this.level === 0) return;
    const orb = this.scene.add.image(from.x, from.y, 'fx_glow').setTint(color).setBlendMode('ADD').setDepth(DEPTH.fx).setScale(0.9 * DPR);
    let last = 0;
    this.flash(from.x, from.y, color, 40 * DPR, 260);
    await tween(this.scene, {
      targets: orb, x: to.x, y: to.y, duration: ms, ease: 'Cubic.easeInOut',
      onUpdate: (tw: Phaser.Tweens.Tween) => { if (tw.progress - last > 0.12) { last = tw.progress; this.burst(orb.x, orb.y, color, 2); } },
    });
    orb.destroy();
    this.flash(to.x, to.y, color, 46 * DPR, 360);
    this.burst(to.x, to.y, color, 10);
  }

  /** A ring of light that expands and fades (station unlock, door opening). */
  ring(x: number, y: number, color: number, from: number, to: number, ms = 520): void {
    if (this.level === 0) return;
    const c = this.scene.add.circle(x, y, from).setStrokeStyle(3 * DPR, color, 1).setDepth(DEPTH.fx);
    this.scene.tweens.add({ targets: c, scale: to / from, alpha: 0, duration: ms, ease: 'Cubic.easeOut', onComplete: () => c.destroy() });
  }

  /** A short burst of rotating sun rays behind a point. */
  raysBrief(x: number, y: number, radius: number, color: number, ms = 700): void {
    if (this.level === 0) return;
    const r = this.scene.add.image(x, y, 'fx_rays').setTint(color).setBlendMode('ADD').setDepth(DEPTH.fx - 1).setScale((radius * 2) / 512).setAlpha(0);
    this.scene.tweens.add({ targets: r, alpha: 0.95, duration: ms * 0.25, yoyo: true, hold: ms * 0.3 });
    this.scene.tweens.add({ targets: r, angle: 90, duration: ms, onComplete: () => r.destroy() });
  }

  /** A few coins hopping out of a point. */
  coinsAt(x: number, y: number, count = 6): void {
    if (this.level === 0) return;
    for (let i = 0; i < Math.round(count * (this.level === 2 ? 1 : 0.5)); i++) {
      const c = this.scene.add.image(x, y, 'fx_coin').setDepth(DEPTH.fx).setScale(0.5 * DPR);
      const dx = (i - count / 2 + 0.5) * 9 * DPR;
      this.scene.tweens.add({ targets: c, x: x + dx, duration: 520, ease: 'Linear' });
      this.scene.tweens.add({ targets: c, y: y - (26 + (i % 3) * 8) * DPR, duration: 260, yoyo: true, ease: 'Quad.easeOut', onComplete: () => c.destroy() });
    }
  }

  /** Slowly drifting dust while the game is idle or running; off at reduced effect levels. */
  ambient(on: boolean): void {
    if (this.dust) { this.dust.destroy(); this.dust = null; }
    if (!on || this.level < 2) return;
    const { width, height } = this.scene.scale;
    this.dust = this.scene.add.particles(0, 0, 'fx_spark', {
      x: { min: 0, max: width }, y: { min: height * 0.15, max: height * 0.85 },
      speedY: { min: -14 * DPR, max: -4 * DPR }, speedX: { min: -5 * DPR, max: 5 * DPR },
      lifespan: 5200, scale: { start: 0.1 * DPR, end: 0.04 * DPR }, alpha: { start: 0, end: 0.4, ease: 'Sine.easeInOut' },
      tint: 0xffe7a8, blendMode: 'ADD', frequency: 420, maxAliveParticles: 16,
    }).setDepth(DEPTH.shade + 0.5);
  }

  /** Falling coins across the screen for big and epic wins. */
  coinRain(ms: number, perSecond: number): void {
    if (this.level === 0) return;
    const { width } = this.scene.scale;
    const rate = perSecond * (this.level === 2 ? 1 : 0.4);
    const ev = this.scene.time.addEvent({
      delay: 1000 / rate, repeat: Math.floor((ms / 1000) * rate),
      callback: () => this.coins.explode(1, Math.random() * width, -20 * DPR), // decoration only
    });
    this.scene.time.delayedCall(ms + 100, () => ev.remove());
  }

  /** Rotating sunburst behind a celebration; returns a function that removes it. */
  rays(x: number, y: number, radius: number): () => void {
    if (this.level === 0) return () => undefined;
    const r = this.scene.add.image(x, y, 'fx_rays').setBlendMode('ADD').setDepth(DEPTH.celebrate - 2).setScale((radius * 2) / 512).setAlpha(0);
    this.scene.tweens.add({ targets: r, alpha: 0.9, duration: 260 });
    const spin = this.scene.tweens.add({ targets: r, angle: 360, duration: 14000, repeat: -1 });
    return () => { spin.stop(); this.scene.tweens.add({ targets: r, alpha: 0, duration: 220, onComplete: () => r.destroy() }); };
  }
}
