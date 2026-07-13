# HomeSense

A mobile app (Expo + React Native + TypeScript) that listens to your home's ambient
sound and alerts you when it hears one of four things:

- 💧 Dripping water
- 🚨 Smoke / CO alarm beeping
- 🐕 Unusual (rapid, repeated) dog barking
- 🔨 Breaking glass

## How detection works

There's no bundled ML model. Detection runs entirely on-device against a rolling
buffer of microphone loudness readings (dBFS), classifying by the *shape* of the
loudness pattern rather than timbre:

| Sound | Pattern it looks for |
|---|---|
| Breaking glass | One isolated, very sharp spike that decays quickly back to baseline |
| Smoke alarm | Loud beeps at a near-perfectly regular interval (quartz-timed alarms are very periodic) |
| Dog barking | Several loud bursts in quick, irregular succession |
| Water drip | Small, faint, evenly spaced ticks in an otherwise quiet room |

See `src/engine/detectors.ts` for the exact rules. This is a lightweight heuristic,
not a trained sound-classification model — it can miss real events and can misfire
on unrelated sounds with a similar amplitude pattern (e.g. rhythmic tapping vs. a
drip). `src/services/soundEngine.ts` is the swap point if you later want to plug in
a real on-device model (e.g. a TFLite YAMNet build) behind the same interface.
Treat alerts as a helpful nudge, not a certified safety device.

Sensitivity is adjustable in Settings (fewer false alarms / balanced / more
sensitive), and each category can be toggled independently.

## Project structure

```
App.tsx                        # entry point: providers + navigation
src/
  types.ts                     # shared types
  constants/categories.ts      # category metadata, notification copy, cooldowns
  constants/theme.ts           # color palette
  engine/
    stats.ts                   # mean/stdev/percentile helpers
    peaks.ts                   # peak picking over a dB stream
    detectors.ts                # the 4 rule-based detectors
    simulate.ts                 # synthetic dB streams for tests + "test alert" buttons
    __test__/detectors.smoke.ts # run with `npx tsx` to sanity-check detection logic
  services/
    audioMonitor.ts             # wraps expo-av recording, streams metering
    soundEngine.ts               # rolling buffer + cooldown/priority arbitration
    notifications.ts             # expo-notifications wrapper
    storage.ts                    # AsyncStorage-backed settings + event log
  context/AppContext.tsx        # wires everything together for the UI
  navigation/RootNavigator.tsx   # bottom tabs: Home / History / Settings
  screens/                      # HomeScreen, HistoryScreen, SettingsScreen
  components/                   # LevelMeter, EventRow
```

## Running it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `a` / `i` for a simulator.
The app needs a real device (or a simulator with a working mic passthrough) to
actually pick up ambient sound — simulators without a mic will just show
"Listening" with a flat level meter.

To sanity-check the detection logic itself without a device:

```bash
npx tsx src/engine/__test__/detectors.smoke.ts
```

This feeds synthetic loudness streams for each category (and a quiet-room
control) through the real detectors and checks each one classifies correctly.

You can also try the **Test alert** buttons on the Home screen at any time —
they run the same synthetic streams through the real detection code and fire a
real notification/history entry, which is useful for seeing the full alert
flow without needing to actually break a glass or run a tap.

## Permissions

- Microphone (`expo-av`) — required to listen at all.
- Notifications (`expo-notifications`) — required to alert you when the app
  isn't in the foreground. If denied, detections still show up in-app (banner
  + History tab) but won't push a system notification.

## Notes / limitations

- `expo-av` is used for recording; it's deprecated upstream in favor of
  `expo-audio`, but is still shipped and functional on Expo SDK 57 at the time
  of writing. Worth revisiting if it's removed in a future SDK.
- The app only ever reads the microphone's metering (loudness) level, never
  raw audio — recordings are rotated and deleted automatically every couple
  of minutes purely to bound disk usage, not to retain audio.
- Detection thresholds were tuned against synthetic test signals
  (`src/engine/simulate.ts`), not real-world recordings, so real-world
  sensitivity will need tuning per room/environment — that's what the
  sensitivity setting is for.
