import { CategoryMeta, SoundCategoryId } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'water_drip',
    label: 'Dripping Water',
    emoji: '💧',
    description: 'Soft, regular dripping in an otherwise quiet room.',
    notificationTitle: '💧 Dripping water detected',
    notificationBody: 'HomeSense heard a regular dripping sound. Might be worth checking a tap or pipe.',
  },
  {
    id: 'smoke_alarm',
    label: 'Smoke Alarm',
    emoji: '🚨',
    description: 'Loud, evenly spaced beeping typical of a smoke or CO alarm.',
    notificationTitle: '🚨 Smoke alarm detected',
    notificationBody: 'HomeSense heard a repeating alarm-like beep. Please check right away.',
  },
  {
    id: 'dog_bark',
    label: 'Unusual Barking',
    emoji: '🐕',
    description: 'A rapid burst of barking, more than a single occasional bark.',
    notificationTitle: '🐕 Unusual barking detected',
    notificationBody: 'HomeSense heard rapid, repeated barking. Your dog might need attention.',
  },
  {
    id: 'glass_break',
    label: 'Breaking Glass',
    emoji: '🔨',
    description: 'A sudden sharp, very loud spike followed by quick decay.',
    notificationTitle: '🔨 Breaking glass detected',
    notificationBody: 'HomeSense heard a sharp shattering sound. Please check your home.',
  },
];

export const CATEGORY_MAP: Record<SoundCategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<SoundCategoryId, CategoryMeta>
);

export const DEFAULT_SENSITIVITY = 0.5;

export const COOLDOWN_MS: Record<SoundCategoryId, number> = {
  water_drip: 60_000,
  smoke_alarm: 30_000,
  dog_bark: 45_000,
  glass_break: 20_000,
};
