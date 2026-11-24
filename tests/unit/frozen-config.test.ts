import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONFIG_V1, assertValidConfig } from '../../src/engine/index.js';

/**
 * The configuration was frozen with milestone M3. The measured figures in
 * docs/math/reports/ only hold for exactly these parameters, so any change
 * must be deliberate: new version, new measurements, new hash here.
 */
describe('frozen configuration v1.0.0', () => {
  it('is valid and has the frozen hash', () => {
    assertValidConfig(CONFIG_V1);
    expect(CONFIG_V1.version).toBe('1.0.0');
    expect(createHash('sha256').update(JSON.stringify(CONFIG_V1)).digest('hex'))
      .toBe('943082d640a065931a87d21e3bb84a953ae27ba653531d4303b22857d75698e3');
  });

  it('matches the exported JSON file', () => {
    const file = JSON.parse(readFileSync(new URL('../../config/game-config.v1.0.0.json', import.meta.url), 'utf8'));
    expect(file).toEqual(CONFIG_V1);
  });
});
