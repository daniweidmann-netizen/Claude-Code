import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES } from '../constants/categories';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';

const SENSITIVITY_LEVELS: { label: string; value: number }[] = [
  { label: 'Fewer false alarms', value: 0.25 },
  { label: 'Balanced', value: 0.5 },
  { label: 'More sensitive', value: 0.75 },
];

export function SettingsScreen() {
  const { settings, setSensitivity, setNotificationsEnabled, toggleCategory } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Sensitivity</Text>
        <View style={styles.segmented}>
          {SENSITIVITY_LEVELS.map((level) => {
            const active = Math.abs(settings.sensitivity - level.value) < 0.01;
            return (
              <TouchableOpacity
                key={level.value}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => setSensitivity(level.value)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{level.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Sound categories</Text>
        <View style={styles.card}>
          {CATEGORIES.map((c, idx) => (
            <View key={c.id} style={[styles.row, idx > 0 && styles.rowBorder]}>
              <Text style={styles.rowEmoji}>{c.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{c.label}</Text>
                <Text style={styles.rowDescription}>{c.description}</Text>
              </View>
              <Switch
                value={settings.enabledCategories[c.id]}
                onValueChange={(v) => toggleCategory(c.id, v)}
                trackColor={{ true: colors.primary }}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { flex: 1 }]}>Send an alert when a sound is detected</Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: colors.primary }}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>How detection works</Text>
        <View style={styles.card}>
          <Text style={styles.about}>
            HomeSense listens to the microphone's loudness pattern in real time and looks for the
            shape each sound tends to make: a single sharp spike for breaking glass, evenly spaced
            beeps for a smoke alarm, rapid loud bursts for barking, and small regular ticks for a
            drip. This is a lightweight on-device heuristic, not a trained sound-recognition model —
            it can miss real events or misfire on similar sounds. Treat alerts as a helpful nudge to
            check in, not a certified safety device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8, marginTop: 20 },
  segmented: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  segmentTextActive: { color: '#fff' },
  card: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowEmoji: { fontSize: 22, marginRight: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowDescription: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  about: { fontSize: 13, color: colors.textMuted, lineHeight: 19, paddingVertical: 14 },
});
