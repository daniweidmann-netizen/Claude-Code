import { describe, expect, it } from 'vitest';
import { CONFIG_V1 } from '../../src/engine/index.js';
import { MEASURED, bracketLabels, historyHtml, paytableHtml, rulesHtml } from '../../src/client/rules-text.js';

describe('rules and paytable texts', () => {
  it('labels the cluster-size brackets', () => {
    expect(bracketLabels(CONFIG_V1)).toEqual(['5', '6', '7', '8–9', '10–11', '12–14', '15–19', '20+']);
  });

  it('shows every paytable value of the configuration', () => {
    const html = paytableHtml(CONFIG_V1, 100);
    expect(html.match(/<td>/g)!.length).toBe(40);
    expect(html).toContain('<td>0.1×</td>');   // Sapphire, 5
    expect(html).toContain('<td>100×</td>');   // Jade Mask, 20+
    expect(html.indexOf('Jade Mask')).toBeLessThan(html.indexOf('Sapphire Gem'));
  });

  it('states the rules with the numbers of the frozen configuration', () => {
    const html = rulesHtml(CONFIG_V1);
    for (const part of [
      'Raster 6×5', 'mindestens 5 gleiche', 'höchstens 50 Kaskaden',
      '<b>Discovery</b> nach 1 Schritt', '<b>Treasure</b> nach 2 Schritten', '<b>Ancient Power</b> nach 4 Schritten',
      '<b>Relic</b> nach 6 Schritten', '<b>Temple</b> nach 9 Schritten',
      '3 Compass: 8 Free Spins, Base Camp auf Station 1', '5+ Compass: 12 Free Spins',
      'Für 58× Einsatz', 'wie nach 3 Compass', 'Höchstgewinn je Runde: 10000× Einsatz',
      'Hauptschatz 2500×', '3 Siegel: bis 10000×', MEASURED.rtp, MEASURED.buyRtp, 'Nicht zertifiziert',
    ]) expect(html, part).toContain(part);
  });

  it('omits the buy section when the feature is disabled and flags a different config version', () => {
    const cfg = { ...CONFIG_V1, version: '9.9.9', featureBuy: { ...CONFIG_V1.featureBuy, enabled: false } };
    const html = rulesHtml(cfg);
    expect(html).not.toContain('Expedition kaufen');
    expect(html).toContain('aktive Konfiguration: 9.9.9');
  });

  it('renders the history and escapes content', () => {
    expect(historyHtml([])).toContain('Noch keine Runde');
    const html = historyHtml([{ seed: '<7>', kind: 'buy', bet: 100, stake: 5800, picks: [2, 0], win: 12345, configVersion: '1.0.0' }]);
    expect(html).toContain('<td>Kauf</td><td>58.00</td><td>123.45</td><td>3, 1</td>');
    expect(html).toContain('data-action="replay" data-value="0"');
    expect(html).toContain('&lt;7&gt;');
  });
});
