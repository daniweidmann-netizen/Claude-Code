import { Sample, SoundCategoryId } from '../types';

/**
 * Generates a synthetic dB stream for a given category, ending at `now`.
 * Used by the "Test alert" buttons and by the detector test script so both
 * exercise the exact same detection code path a real recording would.
 */
export function generateSyntheticStream(category: SoundCategoryId, now: number): Sample[] {
  const samples: Sample[] = [];
  const stepMs = 120;

  const pushQuiet = (fromMs: number, toMs: number, floor = -55, jitter = 4) => {
    for (let t = fromMs; t <= toMs; t += stepMs) {
      samples.push({ t, db: floor + (Math.sin(t) * 0.5 + 0.5) * jitter });
    }
  };

  switch (category) {
    case 'glass_break': {
      pushQuiet(now - 4000, now - 1000);
      samples.push({ t: now - 950, db: -50 });
      samples.push({ t: now - 830, db: -8 });
      samples.push({ t: now - 700, db: -20 });
      samples.push({ t: now - 580, db: -35 });
      pushQuiet(now - 400, now);
      break;
    }
    case 'smoke_alarm': {
      pushQuiet(now - 12000, now - 9000, -50);
      for (let t = now - 9000; t <= now; t += 750) {
        for (let dt = 0; dt < 750; dt += stepMs) {
          const db = dt < 200 ? -12 : -50;
          samples.push({ t: t + dt, db });
        }
      }
      break;
    }
    case 'dog_bark': {
      pushQuiet(now - 10000, now - 8000, -50);
      let t = now - 8000;
      while (t < now) {
        const burst = 150 + Math.random() * 350;
        samples.push({ t, db: -20 - Math.random() * 5 });
        t += burst;
        const gap = 250 + Math.random() * 1200;
        samples.push({ t, db: -48 });
        t += gap;
      }
      break;
    }
    case 'water_drip': {
      let t = now - 24000;
      while (t < now) {
        samples.push({ t, db: -52 });
        t += 100;
        samples.push({ t, db: -42 });
        t += 1400 + Math.random() * 200;
      }
      break;
    }
  }

  return samples.sort((a, b) => a.t - b.t);
}

export function generateQuietStream(now: number, spanMs = 30000): Sample[] {
  const samples: Sample[] = [];
  for (let t = now - spanMs; t <= now; t += 120) {
    samples.push({ t, db: -55 + Math.random() * 5 });
  }
  return samples;
}
