import Phaser from 'phaser';
import { DPR } from './env.js';
import { GameScene } from './scenes/game-scene.js';

const stage = document.getElementById('stage')!;
const size = () => ({ width: Math.max(1, Math.round(stage.clientWidth * DPR)), height: Math.max(1, Math.round(stage.clientHeight * DPR)) });

/** Canvas text can only use a font that is already loaded; wait for the bundled faces (with a time limit). */
async function fontsReady(): Promise<void> {
  const faces = ['700 20px "Cinzel"', '400 16px "Source Sans 3"', '600 16px "Source Sans 3"'];
  const load = Promise.all(faces.map((f) => document.fonts?.load(f) ?? Promise.resolve())).then(() => undefined, () => undefined);
  await Promise.race([load, new Promise<void>((r) => setTimeout(r, 2500))]);
}

void fontsReady().then(() => {
  // The canvas is rendered in device pixels and shown at 1/DPR, so art and text stay sharp on dense screens.
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'stage',
    backgroundColor: '#0b0e16',
    scale: { mode: Phaser.Scale.NONE, ...size(), zoom: 1 / DPR },
    render: { antialias: true, roundPixels: false },
    scene: [GameScene],
  });

  // Mobile browsers fire many resize events while their toolbars slide; apply only real changes, once things settle.
  let timer = 0;
  const resize = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const s = size();
      if (s.width !== game.scale.width || s.height !== game.scale.height) game.scale.resize(s.width, s.height);
    }, 120);
  };
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  window.visualViewport?.addEventListener('resize', resize);
});
