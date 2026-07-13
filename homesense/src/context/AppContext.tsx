import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AudioMonitor } from '../services/audioMonitor';
import { SoundEngine } from '../services/soundEngine';
import { notifyDetection, requestNotificationPermission } from '../services/notifications';
import {
  DEFAULT_SETTINGS,
  appendEvent,
  clearEvents as clearEventsStorage,
  loadEvents,
  loadSettings,
  saveSettings,
  setCategoryEnabled as setCategoryEnabledInSettings,
} from '../services/storage';
import { runDetectors } from '../engine/detectors';
import { generateSyntheticStream } from '../engine/simulate';
import { AppSettings, DetectionEvent, ListeningState, SoundCategoryId } from '../types';

const ANALYSIS_TICK_MS = 1000;
const UI_LEVEL_THROTTLE_MS = 200;

interface AppContextValue {
  settings: AppSettings;
  events: DetectionEvent[];
  listeningState: ListeningState;
  currentDb: number | null;
  lastEvent: DetectionEvent | null;
  errorMessage: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  setSensitivity: (value: number) => void;
  setNotificationsEnabled: (value: boolean) => void;
  toggleCategory: (category: SoundCategoryId, enabled: boolean) => void;
  clearHistory: () => Promise<void>;
  simulateDetection: (category: SoundCategoryId) => Promise<void>;
  dismissError: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [listeningState, setListeningState] = useState<ListeningState>('idle');
  const [currentDb, setCurrentDb] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<DetectionEvent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const monitorRef = useRef<AudioMonitor | null>(null);
  const engineRef = useRef(new SoundEngine());
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUiUpdateRef = useRef(0);

  useEffect(() => {
    (async () => {
      const [loadedSettings, loadedEvents] = await Promise.all([loadSettings(), loadEvents()]);
      setSettings(loadedSettings);
      setEvents(loadedEvents);
    })();
  }, []);

  const persistSettings = useCallback((next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  const fireEvent = useCallback(async (event: DetectionEvent) => {
    setLastEvent(event);
    setEvents((prev) => {
      appendEvent(prev, event);
      return [event, ...prev].slice(0, 200);
    });
    if (settingsRef.current.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await notifyDetection(event);
      }
    }
  }, []);

  const startListening = useCallback(async () => {
    if (listeningState === 'listening' || listeningState === 'starting') return;
    setErrorMessage(null);
    setListeningState('starting');
    engineRef.current.reset();

    const monitor = new AudioMonitor(
      (db, t) => {
        engineRef.current.addSample(db, t);
        if (t - lastUiUpdateRef.current >= UI_LEVEL_THROTTLE_MS) {
          lastUiUpdateRef.current = t;
          setCurrentDb(db);
        }
      },
      (error) => {
        setErrorMessage(error.message);
        setListeningState('error');
      }
    );
    monitorRef.current = monitor;

    try {
      await monitor.start();
      setListeningState('listening');
      tickIntervalRef.current = setInterval(() => {
        const event = engineRef.current.tick(Date.now(), settingsRef.current);
        if (event) fireEvent(event);
      }, ANALYSIS_TICK_MS);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setListeningState('error');
    }
  }, [listeningState, fireEvent]);

  const stopListening = useCallback(async () => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (monitorRef.current) {
      await monitorRef.current.stop();
      monitorRef.current = null;
    }
    setCurrentDb(null);
    setListeningState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      monitorRef.current?.stop();
    };
  }, []);

  const setSensitivity = useCallback(
    (value: number) => persistSettings({ ...settingsRef.current, sensitivity: value }),
    [persistSettings]
  );

  const setNotificationsEnabled = useCallback(
    (value: boolean) => persistSettings({ ...settingsRef.current, notificationsEnabled: value }),
    [persistSettings]
  );

  const toggleCategory = useCallback(
    (category: SoundCategoryId, enabled: boolean) =>
      persistSettings(setCategoryEnabledInSettings(settingsRef.current, category, enabled)),
    [persistSettings]
  );

  const clearHistory = useCallback(async () => {
    await clearEventsStorage();
    setEvents([]);
    setLastEvent(null);
  }, []);

  const simulateDetection = useCallback(
    async (category: SoundCategoryId) => {
      const now = Date.now();
      const samples = generateSyntheticStream(category, now);
      const onlyThis = {
        water_drip: false,
        smoke_alarm: false,
        dog_bark: false,
        glass_break: false,
        [category]: true,
      } as AppSettings['enabledCategories'];
      const results = runDetectors(samples, now, settingsRef.current.sensitivity, onlyThis);
      const confidence = results[0]?.confidence ?? 0.75;
      await fireEvent({ id: `${category}-sim-${now}`, category, confidence, timestamp: now });
    },
    [fireEvent]
  );

  const dismissError = useCallback(() => setErrorMessage(null), []);

  const value: AppContextValue = {
    settings,
    events,
    listeningState,
    currentDb,
    lastEvent,
    errorMessage,
    startListening,
    stopListening,
    setSensitivity,
    setNotificationsEnabled,
    toggleCategory,
    clearHistory,
    simulateDetection,
    dismissError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
