export type SoundCategoryId = 'water_drip' | 'smoke_alarm' | 'dog_bark' | 'glass_break';

export interface CategoryMeta {
  id: SoundCategoryId;
  label: string;
  emoji: string;
  description: string;
  notificationTitle: string;
  notificationBody: string;
}

export interface DetectionEvent {
  id: string;
  category: SoundCategoryId;
  confidence: number;
  timestamp: number;
}

export interface AppSettings {
  sensitivity: number;
  notificationsEnabled: boolean;
  enabledCategories: Record<SoundCategoryId, boolean>;
}

export type ListeningState = 'idle' | 'starting' | 'listening' | 'error';

export interface Sample {
  t: number;
  db: number;
}
