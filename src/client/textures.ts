import Phaser from 'phaser';
import { symbolKey } from './theme.js';

/**
 * Placeholder symbol art, drawn in code. Own work without third-party
 * material; it is replaced by final assets (asset register) later.
 */
export const SYMBOL_SIZE = 128;

export function createPlaceholderTextures(scene: Phaser.Scene): void {
  const S = SYMBOL_SIZE, c = S / 2;
  const make = (id: number, tile: number, draw: (g: Phaser.GameObjects.Graphics) => void) => {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(tile, 1).fillRoundedRect(4, 4, S - 8, S - 8, 18);
    g.lineStyle(3, 0xffffff, 0.12).strokeRoundedRect(4, 4, S - 8, S - 8, 18);
    draw(g);
    g.generateTexture(symbolKey(id), S, S);
    g.destroy();
  };
  const poly = (g: Phaser.GameObjects.Graphics, pts: number[], color: number) => {
    g.fillStyle(color, 1).beginPath().moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    g.closePath().fillPath();
  };

  make(0, 0x14233f, (g) => { // Sapphire Gem
    poly(g, [c, 22, 100, 52, c, 108, 28, 52], 0x3d7bf2);
    poly(g, [c, 22, 82, 52, c, 108, 46, 52], 0x79aaff);
    poly(g, [28, 52, 100, 52, c, 64], 0x1f4fb5);
  });
  make(1, 0x2b2410, (g) => { // Golden Scarab
    g.fillStyle(0xd9a53a, 1).fillEllipse(c, 70, 62, 72);
    g.fillStyle(0xf2cc6b, 1).fillEllipse(c, 34, 34, 24);
    g.lineStyle(4, 0x7a5a16, 1).lineBetween(c, 40, c, 104).lineBetween(34, 56, 94, 56);
  });
  make(2, 0x2e1c12, (g) => { // Golden Chalice
    poly(g, [30, 26, 98, 26, 84, 66, 44, 66], 0xf0b94a);
    g.fillStyle(0xc88d24, 1).fillRect(58, 66, 12, 26).fillRoundedRect(38, 92, 52, 12, 5);
    g.fillStyle(0xfff0b8, 0.7).fillRect(38, 32, 52, 6);
  });
  make(3, 0x35121a, (g) => { // Ruby Crown
    poly(g, [24, 96, 24, 40, 46, 66, c, 28, 82, 66, 104, 40, 104, 96], 0xe0b040);
    g.fillStyle(0xd8324a, 1).fillCircle(c, 78, 11).fillCircle(36, 82, 6).fillCircle(92, 82, 6);
  });
  make(4, 0x0f2a22, (g) => { // Jade Mask
    g.fillStyle(0x43b987, 1).fillRoundedRect(30, 20, 68, 90, { tl: 22, tr: 22, bl: 34, br: 34 });
    g.fillStyle(0x0c2019, 1).fillEllipse(49, 54, 18, 12).fillEllipse(79, 54, 18, 12).fillRoundedRect(50, 84, 28, 8, 4);
    g.fillStyle(0x8fe3bd, 1).fillRect(60, 24, 8, 20);
  });
  make(5, 0x3a2a08, (g) => { // Wild: sun disc
    g.lineStyle(7, 0xffd76a, 1);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      g.lineBetween(c + Math.cos(a) * 32, c + Math.sin(a) * 32, c + Math.cos(a) * 50, c + Math.sin(a) * 50);
    }
    g.fillStyle(0xffd76a, 1).fillCircle(c, c, 28);
    g.fillStyle(0xfff6d0, 1).fillCircle(c, c, 14);
  });
  make(6, 0x1c2030, (g) => { // Compass
    g.fillStyle(0xe9e2cf, 1).fillCircle(c, c, 44);
    g.fillStyle(0x2a3350, 1).fillCircle(c, c, 36);
    poly(g, [c, 26, 74, c, c, 72, 54, c], 0xd0563f);
    poly(g, [c, 102, 74, c, 54, c], 0xe9e2cf);
  });
  make(7, 0x241a33, (g) => { // Temple Key
    g.lineStyle(10, 0xf0c050, 1).strokeCircle(c, 38, 16);
    g.fillStyle(0xf0c050, 1).fillRect(59, 52, 10, 54).fillRect(69, 84, 16, 9).fillRect(69, 98, 12, 8);
  });
  make(8, 0x2a2118, (g) => { // Explorer
    g.fillStyle(0xe0b48a, 1).fillCircle(c, 74, 26);
    g.fillStyle(0x8a5a2c, 1).fillEllipse(c, 52, 92, 18).fillRoundedRect(40, 24, 48, 30, 10);
    g.fillStyle(0x2a2118, 1).fillCircle(54, 76, 4).fillCircle(74, 76, 4);
  });
}
