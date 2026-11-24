export const COLOR = {
  bg: 0x0b0e16, stone: 0x12161f, stoneLight: 0x1d2431, line: 0x39425e,
  gold: 0xe8b84a, goldBright: 0xffd76a, goldDark: 0x8a6a1e, jade: 0x3fae7c, turquoise: 0x39c6c0,
  text: '#f3ead6', dim: '#aab2c4', win: '#ffd76a', danger: 0xd0563f,
  // kept for older call sites
  panel: 0x12161f, panelLight: 0x1d2431,
};
/** Bundled fonts (SIL OFL 1.1, public/fonts): Cinzel for titles and figures, Source Sans 3 for text. */
export const DISPLAY = '"Cinzel", "Trajan Pro", Georgia, serif';
export const TEXT = '"Source Sans 3", "Helvetica Neue", Arial, sans-serif';
export const FONT = DISPLAY;

export const SYMBOL_NAMES = ['Sapphire Gem', 'Golden Scarab', 'Golden Chalice', 'Ruby Crown', 'Jade Mask', 'Wild', 'Compass', 'Temple Key', 'Explorer'];
/** Accent colour per symbol (aura behind the symbol and win glow); helps to tell the three gold symbols apart. */
export const SYMBOL_ACCENT = [0x3d7bf2, 0x39c6c0, 0xf0a030, 0xe0344e, 0x3fae7c, 0xffd76a, 0xe9e2cf, 0xb07cff, 0xffb45a];
export const STATION_NAMES = ['Discovery', 'Treasure', 'Ancient Power', 'Relic', 'Temple'];
/** Each station has its own colour: amber, gold, jade, turquoise, white gold. */
export const STATION_COLOR = [0xf0a030, 0xffd76a, 0x3fae7c, 0x39c6c0, 0xfff1c4];
export const symbolKey = (id: number) => `sym${id}`;

/** Fixed draw order, so nothing overlaps by accident. */
export const DEPTH = { bg: -10, shade: -9, plate: -8, grid: 0, fx: 20, hud: 30, banner: 50, scene: 60, sceneUi: 62, celebrate: 70, start: 90 };
