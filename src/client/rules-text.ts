import type { GameConfig } from '../engine/index.js';
import type { HistoryEntry } from '../session/game-service.js';
import type { Lang } from './i18n.js';
import { asset } from './asset.js';
import { formatMoney, formatMultiple } from './layout.js';
import { STATION_NAMES, SYMBOL_NAMES } from './theme.js';

/**
 * Rules, paytable and history as HTML in English and German, generated from
 * the configuration so the texts cannot drift away from the numbers the
 * engine uses. No DOM access here: the functions return strings and are
 * unit-tested.
 */

/** Simulated figures for configuration 1.0.0 (docs/math/reports/). Not certified. */
export const MEASURED = {
  configVersion: '1.0.0',
  rtp: '95,995 %', rtpInterval: '95,90–96,09 %',
  buyRtp: '96,81 %', buyInterval: '96,74–96,87 %',
};
/** Rounds per autoplay run, shown in the rules (must match the scene's constant). */
export const AUTO_NOTE = 10;
const num = (s: string, lang: Lang) => (lang === 'de' ? s : s.replace(/,/g, '.'));

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export function bracketLabels(cfg: GameConfig): string[] {
  const b = cfg.payBrackets, cells = cfg.cols * cfg.rows;
  return b.map((lo, i) => {
    const hi = i + 1 < b.length ? b[i + 1] - 1 : cells;
    return i + 1 === b.length ? `${lo}+` : hi === lo ? `${lo}` : `${lo}–${hi}`;
  });
}

export function paytableHtml(cfg: GameConfig, bet: number, lang: Lang = 'en'): string {
  const de = lang === 'de';
  const head = bracketLabels(cfg).map((l) => `<th>${l}</th>`).join('');
  const rows = cfg.paytable.map((row, s) => {
    const cells = row.map((v) => `<td>${formatMultiple(v)}</td>`).join('');
    return `<tr><th scope="row"><img src="${asset(`symbols/sym${s}.png`)}" alt="">${esc(SYMBOL_NAMES[s])}</th>${cells}</tr>`;
  }).slice().reverse().join('');
  return `<p>${de
    ? `Gewinn je Cluster als Vielfaches des Gesamteinsatzes (aktueller Einsatz ${formatMoney(bet)}), vor dem Multiplikator. Spalten: Anzahl verbundener Symbole.`
    : `Win per cluster as a multiple of the total bet (current bet ${formatMoney(bet)}), before the multiplier. Columns: number of connected symbols.`}</p>
<p class="dim">${de ? 'Tabelle seitlich verschiebbar.' : 'Swipe the table sideways.'}</p>
<div class="scroll"><table><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function rulesHtml(cfg: GameConfig, lang: Lang = 'en'): string {
  const de = lang === 'de';
  const fs = cfg.freeSpins, fb = cfg.featureBuy, steps = cfg.stationSteps;
  const three = fs.awards.find((a) => a.minCompass === 3);
  const awards = [...fs.awards].reverse().map((a) => `${a.minCompass}${a === fs.awards[0] ? '+' : ''} Compass: ${a.spins} Free Spins, ${de ? 'Base Camp auf Station' : 'Base Camp on station'} ${a.baseCamp}`).join(' · ');
  const effects = de ? [
    `${cfg.discoveryWilds} zufällige Gewinnsymbole werden zu Wilds.`,
    `Der Grundmultiplikator steigt auf ×${cfg.treasureMultiplier}.`,
    'Ein zufälliges Gewinnsymbol wird zum Explorer: ein Wild, das bei Gewinnen nicht entfernt wird.',
    'Ein Sun Relic erscheint, erhöht den Sonnenbonus um seinen Wert und wird zum Wild.',
    'Basisrunde: Der Temple Bonus startet nach dem Spin. Free Spins: ein Tempelsiegel (höchstens eines je Spin).',
  ] : [
    `${cfg.discoveryWilds} random pay symbols turn into Wilds.`,
    `The base multiplier rises to ×${cfg.treasureMultiplier}.`,
    'A random pay symbol becomes the Explorer: a Wild that is not removed by wins.',
    'A Sun Relic appears, adds its value to the sun bonus and turns into a Wild.',
    'Base game: the Temple Bonus starts after the spin. Free spins: one temple seal (at most one per spin).',
  ];
  const stations = STATION_NAMES.map((n, i) => `<li><b>${n}</b> ${de ? `nach ${steps[i]} ${steps[i] === 1 ? 'Schritt' : 'Schritten'}` : `after ${steps[i]} ${steps[i] === 1 ? 'step' : 'steps'}`}: ${effects[i]}</li>`).join('');
  const prize = (p: { kind: string; value: number }) => p.kind === 'freeSpins' ? 'Free Spins'
    : `${p.kind === 'relic' ? 'Relic Bonus ' : p.kind === 'grand' ? (de ? 'Hauptschatz ' : 'Grand treasure ') : (de ? 'Schatz ' : 'Treasure ')}${formatMultiple(p.value)}`;
  const basePrizes = cfg.templeBonus.base.map(prize).join(' · ');
  const grands = cfg.templeBonus.finale.map((tb, i) => `${i + 1} ${de ? 'Siegel' : i === 0 ? 'seal' : 'seals'}: ${de ? 'bis' : 'up to'} ${formatMultiple(Math.max(...tb.map((p) => p.value)))}`).join(' · ');
  const same = three && three.spins === fb.spins && three.baseCamp === fb.baseCamp;
  const rtp = `${num(MEASURED.rtp, lang)}`, rtpI = num(MEASURED.rtpInterval, lang), buy = num(MEASURED.buyRtp, lang), buyI = num(MEASURED.buyInterval, lang);
  const langSwitch = `<p><button data-action="lang" data-value="${de ? 'en' : 'de'}">${de ? 'Switch to English' : 'Auf Deutsch wechseln'}</button></p>`;
  if (de) return `
<h3>Grundspiel</h3>
<ul>
<li>Raster ${cfg.cols}×${cfg.rows}. Ein Cluster sind mindestens ${cfg.minClusterSize} gleiche Symbole, die waagerecht oder senkrecht verbunden sind. Wilds zählen für jedes Gewinnsymbol.</li>
<li>Gewinncluster werden entfernt, Symbole rücken nach, neue fallen von oben. Das wiederholt sich, bis kein Cluster mehr entsteht (höchstens ${cfg.maxCascades} Kaskaden je Spin).</li>
<li>Gewinn = Clusterwert × Multiplikator. Multiplikator = Grundmultiplikator + Sonnenbonus.</li>
</ul>
<h3>Symbole</h3>
<div class="sym">
<img src="${asset('symbols/sym4.png')}" alt=""><span><b>Gewinnsymbole</b> (hoch nach tief): Jade Mask, Ruby Crown, Golden Chalice, Golden Scarab, Sapphire Gem. Werte siehe Reiter «Auszahlungen».</span>
<img src="${asset('symbols/sym5.png')}" alt=""><span><b>Wild</b>: zählt für jedes Gewinnsymbol und kann zu mehreren Clustern gleichzeitig gehören. Ein Cluster braucht mindestens ein Gewinnsymbol. Wilds fallen nicht von oben; sie entstehen durch die Stationen Discovery und Relic.</span>
<img src="${asset('symbols/sym8.png')}" alt=""><span><b>Explorer</b>: ein Wild, das nach einem Gewinn stehen bleibt. Entsteht durch die Station Ancient Power.</span>
<img src="${asset('symbols/sym6.png')}" alt=""><span><b>Compass</b>: zahlt nicht. 3 oder mehr auf dem Raster am Ende eines Spins lösen Free Spins aus.</span>
<img src="${asset('symbols/sym7.png')}" alt=""><span><b>Temple Key</b>: zahlt nicht. Jeder Key auf dem Raster zählt bei einer Gewinnkaskade als zusätzlicher Schritt und wird dann entfernt.</span>
</div>
<h3>Expedition Track</h3>
<p>Jede Gewinnkaskade ist ein Schritt, jeder Temple Key auf dem Raster ein weiterer. Der Track beginnt bei jedem bezahlten Spin neu.</p>
<ol>${stations}</ol>
<h3>Temple Bonus</h3>
<p>Drei Kammern, eine Wahl. Die Preise werden zufällig gezogen und auf die Kammern verteilt, bevor du wählst; deine Wahl bestimmt den Gewinn. Ein Relic Bonus erlaubt eine weitere Kammer. Danach werden die übrigen Kammern aufgedeckt.</p>
<p>Mögliche Preise in der Basisrunde: ${basePrizes}.</p>
<h3>Free Spins</h3>
<ul>
<li>${awards}.</li>
<li>Jeder Free Spin beginnt auf der Base-Camp-Station; ihre Effekte wirken sofort. Temple Keys in Gewinnkaskaden heben das Base Camp um je eine Station (höchstens Station ${fs.maxBaseCamp}).</li>
<li>Der Sonnenbonus bleibt über alle Free Spins erhalten.</li>
<li>${fs.retriggerCompass}+ Compass während der Free Spins: +${fs.retriggerSpins} Free Spins (höchstens ${fs.maxSpins} insgesamt).</li>
<li>Temple Finale: Mit mindestens einem Tempelsiegel folgt nach den Free Spins ein Temple Bonus ohne Free-Spin-Preis. Hauptschatz: ${grands}.</li>
</ul>
${fb.enabled ? `<h3>Expedition kaufen</h3>
<p>Für ${formatMultiple(fb.price)} Einsatz startet die Runde direkt mit ${fb.spins} Free Spins und Base Camp auf Station ${fb.baseCamp}${same ? ' – wie nach 3 Compass' : ''}. Eine Basisrunde findet nicht statt. Ein Gewinn ist nicht garantiert.</p>` : ''}
<h3>Bedienung</h3>
<ul>
<li>Einsatz: Minus und Plus, oder den Betrag antippen und eine Stufe wählen. Der Einsatz gilt für die ganze Runde und kann während einer Runde nicht geändert werden.</li>
<li>Sonnenscheibe: startet einen Spin. Während einer Runde beschleunigt sie die Darstellung.</li>
<li>AUTO: spielt bis zu ${AUTO_NOTE} Runden hintereinander; erneutes Antippen stoppt. Eine Kammerwahl wartet immer auf dich.</li>
<li>Alle Gewinne werden als Vielfaches des Gesamteinsatzes berechnet und auf die kleinste Währungseinheit genau ausgezahlt.</li>
</ul>
<h3>Grenzen</h3>
<p>Höchstgewinn je Runde: ${formatMultiple(cfg.maxWin)} Einsatz. Wird er erreicht, endet die Runde sofort.</p>
<h3>Auszahlungsquote</h3>
<p>Simulierter RTP ${rtp} (2 Mrd. Runden, 95 %-Intervall ${rtpI}).${fb.enabled ? ` Expedition kaufen: simulierter RTP ${buy} (95 %-Intervall ${buyI}).` : ''} Werte für Konfiguration ${MEASURED.configVersion}; aktive Konfiguration: ${esc(cfg.version)}. <b>Nicht zertifiziert</b> – kein Prüflabor hat dieses Spiel geprüft.</p>
<p class="dim">Demo ohne Echtgeld. Tempo, Überspringen und Autoplay ändern kein Ergebnis; jede Runde ist entschieden, bevor sie gezeigt wird (im Temple Bonus: bis auf deine Kammerwahl).</p>
${langSwitch}`;
  return `
<h3>Base game</h3>
<ul>
<li>Grid ${cfg.cols}×${cfg.rows}. A cluster is at least ${cfg.minClusterSize} matching symbols connected horizontally or vertically. Wilds count as any pay symbol.</li>
<li>Winning clusters are removed, symbols drop down and new ones fall in from above. This repeats until no cluster forms (at most ${cfg.maxCascades} cascades per spin).</li>
<li>Win = cluster value × multiplier. Multiplier = base multiplier + sun bonus.</li>
</ul>
<h3>Symbols</h3>
<div class="sym">
<img src="${asset('symbols/sym4.png')}" alt=""><span><b>Pay symbols</b> (high to low): Jade Mask, Ruby Crown, Golden Chalice, Golden Scarab, Sapphire Gem. Values are on the Paytable tab.</span>
<img src="${asset('symbols/sym5.png')}" alt=""><span><b>Wild</b>: counts as any pay symbol and can belong to several clusters at once. A cluster needs at least one pay symbol. Wilds do not fall from above; they are created by the stations Discovery and Relic.</span>
<img src="${asset('symbols/sym8.png')}" alt=""><span><b>Explorer</b>: a Wild that stays in place after a win. Created by the station Ancient Power.</span>
<img src="${asset('symbols/sym6.png')}" alt=""><span><b>Compass</b>: does not pay. 3 or more on the grid at the end of a spin trigger free spins.</span>
<img src="${asset('symbols/sym7.png')}" alt=""><span><b>Temple Key</b>: does not pay. Every key on the grid counts as one extra step in a winning cascade and is then removed.</span>
</div>
<h3>Expedition Track</h3>
<p>Every winning cascade is one step, and every Temple Key on the grid is one more. The track starts again with every paid spin.</p>
<ol>${stations}</ol>
<h3>Temple Bonus</h3>
<p>Three chambers, one choice. The prizes are drawn at random and placed in the chambers before you choose; your choice decides the win. A Relic Bonus lets you open another chamber. Afterwards the remaining chambers are revealed.</p>
<p>Possible prizes in the base game: ${basePrizes}.</p>
<h3>Free spins</h3>
<ul>
<li>${awards}.</li>
<li>Every free spin starts on the Base Camp station; its effects apply at once. Temple Keys in winning cascades raise the Base Camp by one station each (up to station ${fs.maxBaseCamp}).</li>
<li>The sun bonus is kept across all free spins.</li>
<li>${fs.retriggerCompass}+ Compass during free spins: +${fs.retriggerSpins} free spins (at most ${fs.maxSpins} in total).</li>
<li>Temple Finale: with at least one temple seal, a Temple Bonus without a free-spin prize follows the free spins. Grand treasure: ${grands}.</li>
</ul>
${fb.enabled ? `<h3>Buy Expedition</h3>
<p>For ${formatMultiple(fb.price)} bet the round starts directly with ${fb.spins} free spins and Base Camp on station ${fb.baseCamp}${same ? ' – the same as after 3 Compass' : ''}. No base spin is played. A win is not guaranteed.</p>` : ''}
<h3>Controls</h3>
<ul>
<li>Bet: minus and plus, or tap the amount and choose a level. The bet applies to the whole round and cannot be changed during a round.</li>
<li>Sun disc: starts a spin. During a round it speeds up the presentation.</li>
<li>AUTO: plays up to ${AUTO_NOTE} rounds in a row; tap again to stop. A chamber choice always waits for you.</li>
<li>All wins are calculated as multiples of the total bet and paid exactly to the smallest currency unit.</li>
</ul>
<h3>Limits</h3>
<p>Maximum win per round: ${formatMultiple(cfg.maxWin)} bet. When it is reached, the round ends at once.</p>
<h3>Return to player</h3>
<p>Simulated RTP ${rtp} (2 billion rounds, 95 % interval ${rtpI}).${fb.enabled ? ` Buy Expedition: simulated RTP ${buy} (95 % interval ${buyI}).` : ''} Figures for configuration ${MEASURED.configVersion}; active configuration: ${esc(cfg.version)}. <b>Not certified</b> – no test laboratory has examined this game.</p>
<p class="dim">Demo without real money. Speed, skipping and autoplay change no result; every round is decided before it is shown (in the Temple Bonus: except for your choice of chamber).</p>
${langSwitch}`;
}

export function historyHtml(entries: readonly HistoryEntry[], lang: Lang = 'en'): string {
  const de = lang === 'de';
  if (entries.length === 0) return `<p>${de ? 'Noch keine Runde gespielt.' : 'No round played yet.'}</p>`;
  const rows = entries.map((e, i) => `<tr><td>${i + 1}</td><td>${e.kind === 'buy' ? (de ? 'Kauf' : 'Buy') : 'Spin'}</td><td>${formatMoney(e.stake)}</td><td>${formatMoney(e.win)}</td><td>${e.picks.length ? e.picks.map((p) => p + 1).join(', ') : '–'}</td><td class="seed">${esc(e.seed)}</td><td><button data-action="replay" data-value="${i}">${de ? 'Wiedergabe' : 'Replay'}</button></td></tr>`).join('');
  return `<p>${de
    ? `Letzte ${entries.length} Runden, neueste zuerst. Mit Seed, Rundenart und Kammerwahl lässt sich jede Runde exakt wiedergeben. Die Wiedergabe ändert das Guthaben nicht.`
    : `Last ${entries.length} rounds, newest first. Seed, round type and chamber choices reproduce every round exactly. A replay does not change the balance.`}</p>
<div class="scroll"><table><thead><tr><th>#</th><th>${de ? 'Art' : 'Type'}</th><th>${de ? 'Kosten' : 'Cost'}</th><th>${de ? 'Gewinn' : 'Win'}</th><th>${de ? 'Kammern' : 'Chambers'}</th><th>Seed</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export interface PerfInfo { frames: number; seconds: number; fps: number; slowShare: number; worstMs: number; dpr: number; canvas: string; renderer: string; reducedMotion: boolean; fxLevel: number }

export function perfHtml(p: PerfInfo, verdict: string, lang: Lang = 'en'): string {
  const de = lang === 'de';
  const row = (k: string, v: string) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`;
  const fx = de ? ['aus', 'leicht', 'voll'] : ['off', 'light', 'full'];
  return `<p>${de
    ? 'Gemessen wird nur, während eine Runde abläuft. Spiele etwa 20 Runden ohne Beschleunigen (zweimal AUTO), dann hierher zurück.'
    : 'Measured only while a round is running. Play about 20 rounds without speeding up (AUTO twice), then come back here.'}</p>
<p><b>${esc(verdict)}</b></p>
<table><tbody>
${row(de ? 'Bilder pro Sekunde (Durchschnitt)' : 'Frames per second (average)', p.fps.toFixed(1))}
${row(de ? 'Anteil langsamer Bilder (unter 30 pro Sekunde)' : 'Share of slow frames (below 30 per second)', `${(p.slowShare * 100).toFixed(1)} %`)}
${row(de ? 'Längstes Einzelbild' : 'Longest single frame', `${p.worstMs.toFixed(0)} ms`)}
${row(de ? 'Gemessene Dauer' : 'Measured time', `${p.seconds.toFixed(0)} s (${p.frames} ${de ? 'Bilder' : 'frames'})`)}
${row(de ? 'Pixeldichte / Zeichenfläche' : 'Pixel density / canvas', `${p.dpr} / ${p.canvas}`)}
${row(de ? 'Darstellung' : 'Renderer', p.renderer)}
${row(de ? 'Effekte' : 'Effects', fx[p.fxLevel] ?? String(p.fxLevel))}
${row(de ? 'Reduzierte Bewegung' : 'Reduced motion', p.reducedMotion ? (de ? 'ein' : 'on') : (de ? 'aus' : 'off'))}
</tbody></table>
<p><button data-action="perf-reset" data-value="">${de ? 'Messung zurücksetzen' : 'Reset measurement'}</button></p>
<p class="dim">${de ? 'Bildwiederholraten über 60 sind auf Displays mit 90 oder 120 Hz normal. Sinkt die Bildrate, schaltet das Spiel die Effekte selbst zurück.' : 'Frame rates above 60 are normal on 90 or 120 Hz displays. If the frame rate drops, the game reduces its effects by itself.'}</p>`;
}

export interface SettingsInfo { volume: number; muted: boolean; fxLevel: number; reducedMotion: boolean; demo?: boolean }

export function settingsHtml(v: SettingsInfo, lang: Lang = 'en'): string {
  const de = lang === 'de';
  const fx = de ? ['Aus', 'Leicht', 'Voll'] : ['Off', 'Light', 'Full'];
  const fxButtons = fx.map((label, i) => `<button data-action="fx" data-value="${i}" aria-pressed="${v.fxLevel === i}"${v.fxLevel === i ? ' aria-selected="true"' : ''}>${label}</button>`).join('');
  return `<h3>${de ? 'Ton' : 'Sound'}</h3>
<label for="tls-volume">${de ? 'Lautstärke' : 'Volume'}</label>
<input id="tls-volume" type="range" min="0" max="100" step="5" value="${Math.round(v.volume * 100)}" data-action="volume">
<div class="row"><button data-action="mute" data-value="">${v.muted ? (de ? 'Ton einschalten' : 'Unmute') : (de ? 'Stumm schalten' : 'Mute')}</button></div>
<h3>${de ? 'Effekte' : 'Effects'}</h3>
<p>${de ? 'Lichteffekte und Partikel. Das Spiel senkt die Stufe selbst, wenn die Bildrate fällt; eine eigene Wahl bleibt bestehen.' : 'Light effects and particles. The game lowers the level by itself when the frame rate drops; your own choice is kept.'}</p>
<div class="row">${fxButtons}</div>
<p class="dim">${v.reducedMotion ? (de ? 'Reduzierte Bewegung ist aktiv (Systemeinstellung): Bewegungen werden durch kurze Überblendungen ersetzt.' : 'Reduced motion is active (system setting): movement is replaced by short fades.') : (de ? 'Reduzierte Bewegung folgt der Systemeinstellung des Geräts.' : 'Reduced motion follows the device\'s system setting.')}</p>
<h3>${de ? 'Sprache' : 'Language'}</h3>
<div class="row"><button data-action="lang" data-value="${de ? 'en' : 'de'}">${de ? 'Switch to English' : 'Auf Deutsch wechseln'}</button></div>
<h3>${de ? 'Demonstration' : 'Demonstration'}</h3>
<p>${de ? 'Spielt vier vorbereitete Runden mit festen Seeds: eine Kaskade, eine lange Expedition, Free Spins und den Temple Bonus. Die Ergebnisse berechnet dieselbe Engine wie bei jeder anderen Runde; nichts ist gestellt.' : 'Plays four prepared rounds with fixed seeds: a cascade, a long expedition, free spins and the Temple Bonus. The results are computed by the same engine as every other round; nothing is staged.'} ${de ? 'Guthaben und Verlauf bleiben unverändert.' : 'Balance and history stay unchanged.'}</p>
<div class="row"><button data-action="demo" data-value="">${v.demo ? (de ? 'Demonstration beenden' : 'End demonstration') : (de ? 'Demonstration starten' : 'Start demonstration')}</button></div>`;
}
