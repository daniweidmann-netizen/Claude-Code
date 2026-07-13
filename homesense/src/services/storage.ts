import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SENSITIVITY } from '../constants/categories';
import { AppSettings, DetectionEvent, SoundCategoryId } from '../types';

const SETTINGS_KEY = 'homesense.settings.v1';
const EVENTS_KEY = 'homesense.events.v1';
const MAX_EVENTS = 200;

export const DEFAULT_SETTINGS: AppSettings = {
  sensitivity: DEFAULT_SENSITIVITY,
  notificationsEnabled: true,
  enabledCategories: {
    water_drip: true,
    smoke_alarm: true,
    dog_bark: true,
    glass_break: true,
  },
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      enabledCategories: { ...DEFAULT_SETTINGS.enabledCategories, ...parsed.enabledCategories },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadEvents(): Promise<DetectionEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function appendEvent(events: DetectionEvent[], event: DetectionEvent): Promise<DetectionEvent[]> {
  const next = [event, ...events].slice(0, MAX_EVENTS);
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(next));
  return next;
}

export async function clearEvents(): Promise<void> {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify([]));
}

export function setCategoryEnabled(
  settings: AppSettings,
  category: SoundCategoryId,
  enabled: boolean
): AppSettings {
  return {
    ...settings,
    enabledCategories: { ...settings.enabledCategories, [category]: enabled },
  };
}
