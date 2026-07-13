import { runDetectors } from '../detectors';
import { generateSyntheticStream, generateQuietStream } from '../simulate';
import { SoundCategoryId } from '../../types';

const enabledAll: Record<SoundCategoryId, boolean> = {
  water_drip: true,
  smoke_alarm: true,
  dog_bark: true,
  glass_break: true,
};

const categories: SoundCategoryId[] = ['glass_break', 'smoke_alarm', 'dog_bark', 'water_drip'];
let failures = 0;

for (const category of categories) {
  const now = Date.now();
  const samples = generateSyntheticStream(category, now);
  const results = runDetectors(samples, now, 0.5, enabledAll);
  const top = results[0];
  const ok = !!top && top.category === category;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${category} ->`, results);
  if (!ok) failures++;
}

// Quiet stream should not trigger anything at default sensitivity.
{
  const now = Date.now();
  const samples = generateQuietStream(now);
  const results = runDetectors(samples, now, 0.5, enabledAll);
  const ok = results.length === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'} quiet_room -> no false positive`, results);
  if (!ok) failures++;
}

if (failures > 0) {
  console.error(`${failures} detector check(s) failed`);
  process.exit(1);
} else {
  console.log('All detector smoke checks passed.');
}
