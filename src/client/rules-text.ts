import type { GameConfig } from '../engine/index.js';
import type { HistoryEntry } from '../session/game-service.js';
import { formatMoney, formatMultiple } from './layout.js';
import { STATION_NAMES, SYMBOL_NAMES } from './theme.js';

/**
 * Rules, paytable and history as HTML, generated from the configuration so
 * the texts cannot drift away from the numbers the engine uses.
 * No DOM access here: the functions return strings and are unit-tested.
 */

/** Simulated figures for configuration 1.0.0 (docs/math/reports/). Not certified. */
export const MEASURED = {
  configVersion: '1.0.0',
  rtp: '95,995 %', rtpRounds: '2 Mrd. Runden', rtpInterval: '95,90–96,09 %',
  buyRtp: '96,81 %', buyInterval: '96,74–96,87 %',
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export function bracketLabels(cfg: GameConfig): string[] {
  const b = cfg.payBrackets, cells = cfg.cols * cfg.rows;
  return b.map((lo, i) => {
    const hi = i + 1 < b.length ? b[i + 1] - 1 : cells;
    return i + 1 === b.length ? `${lo}+` : hi === lo ? `${lo}` : `${lo}–${hi}`;
  });
}

export function paytableHtml(cfg: GameConfig, bet: number): string {
  const head = bracketLabels(cfg).map((l) => `<th>${l}</th>`).join('');
  const rows = cfg.paytable.map((row, s) => {
    const cells = row.map((v) => `<td>${formatMultiple(v)}</td>`).join('');
    return `<tr><th scope="row"><img src="symbols/sym${s}.png" alt="">${esc(SYMBOL_NAMES[s])}</th>${cells}</tr>`;
  }).slice().reverse().join('');
  return `<p>Gewinn je Cluster als Vielfaches des Gesamteinsatzes (aktueller Einsatz ${formatMoney(bet)}), vor dem Multiplikator. Spalten: Anzahl verbundener Symbole.</p>
<p class="dim">Tabelle seitlich verschiebbar.</p>
<div class="scroll"><table><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function rulesHtml(cfg: GameConfig): string {
  const fs = cfg.freeSpins, fb = cfg.featureBuy, steps = cfg.stationSteps;
  const three = fs.awards.find((a) => a.minCompass === 3);
  const awards = [...fs.awards].reverse().map((a) => `${a.minCompass}${a === fs.awards[0] ? '+' : ''} Compass: ${a.spins} Free Spins, Base Camp auf Station ${a.baseCamp}`).join(' · ');
  const stations = STATION_NAMES.map((n, i) => `<li><b>${n}</b> nach ${steps[i]} ${steps[i] === 1 ? 'Schritt' : 'Schritten'}: ${[
    `${cfg.discoveryWilds} zufällige Gewinnsymbole werden zu Wilds.`,
    `Der Grundmultiplikator steigt auf ×${cfg.treasureMultiplier}.`,
    'Ein zufälliges Gewinnsymbol wird zum Explorer: ein Wild, das bei Gewinnen nicht entfernt wird.',
    'Ein Sun Relic erscheint, erhöht den Sonnenbonus um seinen Wert und wird zum Wild.',
    'Basisrunde: Der Temple Bonus startet nach dem Spin. Free Spins: ein Tempelsiegel (höchstens eines je Spin).',
  ][i]}</li>`).join('');
  const prize = (p: { kind: string; value: number }) => p.kind === 'freeSpins' ? 'Free Spins' : `${p.kind === 'relic' ? 'Relic Bonus ' : p.kind === 'grand' ? 'Hauptschatz ' : 'Schatz '}${formatMultiple(p.value)}`;
  const basePrizes = cfg.templeBonus.base.map(prize).join(' · ');
  const grands = cfg.templeBonus.finale.map((t, i) => `${i + 1} Siegel: bis ${formatMultiple(Math.max(...t.map((p) => p.value)))}`).join(' · ');
  return `
<h3>Grundspiel</h3>
<ul>
<li>Raster ${cfg.cols}×${cfg.rows}. Ein Cluster sind mindestens ${cfg.minClusterSize} gleiche Symbole, die waagerecht oder senkrecht verbunden sind. Wilds zählen für jedes Gewinnsymbol.</li>
<li>Gewinncluster werden entfernt, Symbole rücken nach, neue fallen von oben. Das wiederholt sich, bis kein Cluster mehr entsteht (höchstens ${cfg.maxCascades} Kaskaden je Spin).</li>
<li>Gewinn = Clusterwert × Multiplikator. Multiplikator = Grundmultiplikator + Sonnenbonus.</li>
</ul>
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
<p>Für ${formatMultiple(fb.price)} Einsatz startet die Runde direkt mit ${fb.spins} Free Spins und Base Camp auf Station ${fb.baseCamp}${three && three.spins === fb.spins && three.baseCamp === fb.baseCamp ? ' – wie nach 3 Compass' : ''}. Eine Basisrunde findet nicht statt. Ein Gewinn ist nicht garantiert.</p>` : ''}
<h3>Grenzen</h3>
<p>Höchstgewinn je Runde: ${formatMultiple(cfg.maxWin)} Einsatz. Wird er erreicht, endet die Runde sofort.</p>
<h3>Auszahlungsquote</h3>
<p>Simulierter RTP ${MEASURED.rtp} (${MEASURED.rtpRounds}, 95 %-Intervall ${MEASURED.rtpInterval}).${fb.enabled ? ` Expedition kaufen: simulierter RTP ${MEASURED.buyRtp} (95 %-Intervall ${MEASURED.buyInterval}).` : ''} Werte für Konfiguration ${MEASURED.configVersion}; aktive Konfiguration: ${esc(cfg.version)}. <b>Nicht zertifiziert</b> – kein Prüflabor hat dieses Spiel geprüft.</p>
<p class="dim">Demo ohne Echtgeld. Tempo, Überspringen und Autoplay ändern kein Ergebnis; jede Runde ist entschieden, bevor sie gezeigt wird (im Temple Bonus: bis auf deine Kammerwahl).</p>`;
}

export function historyHtml(entries: readonly HistoryEntry[]): string {
  if (entries.length === 0) return '<p>Noch keine Runde gespielt.</p>';
  const rows = entries.map((e, i) => `<tr><td>${i + 1}</td><td>${e.kind === 'buy' ? 'Kauf' : 'Spin'}</td><td>${formatMoney(e.stake)}</td><td>${formatMoney(e.win)}</td><td>${e.picks.length ? e.picks.map((p) => p + 1).join(', ') : '–'}</td><td class="seed">${esc(e.seed)}</td><td><button data-action="replay" data-value="${i}">Wiedergabe</button></td></tr>`).join('');
  return `<p>Letzte ${entries.length} Runden, neueste zuerst. Mit Seed, Rundenart und Kammerwahl lässt sich jede Runde exakt wiedergeben. Die Wiedergabe ändert das Guthaben nicht.</p>
<div class="scroll"><table><thead><tr><th>#</th><th>Art</th><th>Kosten</th><th>Gewinn</th><th>Kammern</th><th>Seed</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export interface PerfInfo { frames: number; seconds: number; fps: number; slowShare: number; worstMs: number; dpr: number; canvas: string; renderer: string; reducedMotion: boolean }

export function perfHtml(p: PerfInfo, verdict: string): string {
  const row = (k: string, v: string) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`;
  return `<p>Gemessen wird nur, während eine Runde abläuft. Spiele etwa 20 Runden ohne Beschleunigen (zweimal AUTO), dann hierher zurück.</p>
<p><b>${esc(verdict)}</b></p>
<table><tbody>
${row('Bilder pro Sekunde (Durchschnitt)', p.fps.toFixed(1))}
${row('Anteil langsamer Bilder (unter 30 pro Sekunde)', `${(p.slowShare * 100).toFixed(1)} %`)}
${row('Längstes Einzelbild', `${p.worstMs.toFixed(0)} ms`)}
${row('Gemessene Dauer', `${p.seconds.toFixed(0)} s (${p.frames} Bilder)`)}
${row('Pixeldichte / Zeichenfläche', `${p.dpr} / ${p.canvas}`)}
${row('Darstellung', p.renderer)}
${row('Reduzierte Bewegung', p.reducedMotion ? 'ein' : 'aus')}
</tbody></table>
<p><button data-action="perf-reset" data-value="">Messung zurücksetzen</button></p>
<p class="dim">Bildwiederholraten über 60 sind auf Displays mit 90 oder 120 Hz normal.</p>`;
}
