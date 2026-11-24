import Phaser from 'phaser';
import { GameScene } from './scenes/game-scene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#0b0e16',
  scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
  render: { antialias: true, roundPixels: false },
  scene: [GameScene],
});
