import Phaser from 'phaser';
import { DPR } from './env.js';
import { GameScene } from './scenes/game-scene.js';

const stage = document.getElementById('stage')!;
const size = () => ({ width: Math.max(1, Math.round(stage.clientWidth * DPR)), height: Math.max(1, Math.round(stage.clientHeight * DPR)) });

// The canvas is rendered in device pixels and shown at 1/DPR, so art and text stay sharp on dense screens.
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  backgroundColor: '#0b0e16',
  scale: { mode: Phaser.Scale.NONE, ...size(), zoom: 1 / DPR },
  render: { antialias: true, roundPixels: false },
  scene: [GameScene],
});

const resize = () => { const s = size(); game.scale.resize(s.width, s.height); };
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
