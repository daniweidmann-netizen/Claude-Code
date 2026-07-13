import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const ROTATE_MS = 2 * 60 * 1000;
const METERING_INTERVAL_MS = 120;

export type SampleListener = (db: number, t: number) => void;
export type ErrorListener = (error: Error) => void;

/**
 * Keeps a single expo-av Recording running continuously to stream metering
 * (loudness) updates. We only ever read `status.metering`, never the audio
 * content, so the recording file itself is thrown away and rotated
 * periodically just to bound disk usage.
 */
export class AudioMonitor {
  private recording: Audio.Recording | null = null;
  private rotateTimer: ReturnType<typeof setTimeout> | null = null;
  private active = false;
  private onSample: SampleListener;
  private onError: ErrorListener;

  constructor(onSample: SampleListener, onError: ErrorListener) {
    this.onSample = onSample;
    this.onError = onError;
  }

  async requestPermission(): Promise<boolean> {
    const response = await Audio.requestPermissionsAsync();
    return response.granted;
  }

  async start(): Promise<void> {
    if (this.active) return;
    const granted = await this.requestPermission();
    if (!granted) {
      throw new Error('Microphone permission was not granted.');
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    this.active = true;
    await this.beginCycle();
  }

  async stop(): Promise<void> {
    this.active = false;
    if (this.rotateTimer) {
      clearTimeout(this.rotateTimer);
      this.rotateTimer = null;
    }
    await this.teardownCurrent();
  }

  private async beginCycle(): Promise<void> {
    if (!this.active) return;
    try {
      const { recording } = await Audio.Recording.createAsync(
        { ...Audio.RecordingOptionsPresets.LOW_QUALITY, isMeteringEnabled: true },
        (status) => {
          if (status.isRecording && typeof status.metering === 'number') {
            this.onSample(status.metering, Date.now());
          }
        },
        METERING_INTERVAL_MS
      );
      this.recording = recording;
      this.rotateTimer = setTimeout(() => {
        this.rotateCycle();
      }, ROTATE_MS);
    } catch (err) {
      this.active = false;
      this.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private async rotateCycle(): Promise<void> {
    if (!this.active) return;
    await this.teardownCurrent();
    await this.beginCycle();
  }

  private async teardownCurrent(): Promise<void> {
    const current = this.recording;
    this.recording = null;
    if (!current) return;
    try {
      await current.stopAndUnloadAsync();
      const uri = current.getURI();
      if (uri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch {
      // Recording may already be unloaded (e.g. app backgrounded mid-cycle); safe to ignore.
    }
  }
}
