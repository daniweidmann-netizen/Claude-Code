/**
 * Builds one self-contained HTML file with code, pictures, audio and fonts
 * embedded, for testing without a web server:  node tools/build-single.cjs
 * Output: dist-single/temple-of-the-lost-sun.html
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, SINGLE: '1' } });
const out = 'dist-single';
const mime = { '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.json': 'application/json', '.woff2': 'font/woff2' };
const table = {};
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (mime[path.extname(name)]) table[path.relative('public', full).split(path.sep).join('/')] = `data:${mime[path.extname(name)]};base64,${fs.readFileSync(full).toString('base64')}`;
  }
};
walk('public');
const js = fs.readFileSync(path.join(out, 'game.js'), 'utf8').replace(/<\/script/g, '<\\/script');
const font = (file) => table[`fonts/${file}`];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>Temple of the Lost Sun – Demo</title>
<style>
@font-face { font-family: "Cinzel"; font-weight: 700; font-display: block; src: url("${font('cinzel-latin-700-normal.woff2')}") format("woff2"); }
@font-face { font-family: "Source Sans 3"; font-weight: 400; font-display: block; src: url("${font('source-sans-3-latin-400-normal.woff2')}") format("woff2"); }
@font-face { font-family: "Source Sans 3"; font-weight: 600; font-display: block; src: url("${font('source-sans-3-latin-600-normal.woff2')}") format("woff2"); }
html, body { margin: 0; height: 100%; background: #0b0e16; overflow: hidden; overscroll-behavior: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
#app { position: fixed; inset: 0; padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
#stage { width: 100%; height: 100%; overflow: hidden; }
canvas { display: block; touch-action: none; }
</style>
</head>
<body>
<div id="app"><div id="stage"></div></div>
<script>window.__TLS_ASSETS = ${JSON.stringify(Object.fromEntries(Object.entries(table).filter(([k]) => !k.startsWith('fonts/'))))};</script>
<script>${js}</script>
</body>
</html>
`;
const file = path.join(out, 'temple-of-the-lost-sun.html');
fs.writeFileSync(file, html);
for (const name of fs.readdirSync(out)) if (name !== 'temple-of-the-lost-sun.html') fs.rmSync(path.join(out, name), { recursive: true, force: true });
console.log(`${file}  ${(fs.statSync(file).size / 1048576).toFixed(1)} MB, ${Object.keys(table).length} embedded assets`);
