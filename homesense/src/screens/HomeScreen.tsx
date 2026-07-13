import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, CATEGORY_MAP } from '../constants/categories';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { LevelMeter } from '../components/LevelMeter';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Not listening',
  starting: 'Starting…',
  listening: 'Listening',
  error: 'Something went wrong',
};

export function HomeScreen() {
  const { listeningState, currentDb, lastEvent, errorMessage, startListening, stopListening, simulateDetection, dismissError } =
    useApp();

  const isListening = listeningState === 'listening';
  const isBusy = listeningState === 'starting';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>HomeSense</Text>
        <Text style={styles.subtitle}>Listens for the sounds that matter while you're away.</Text>

        {errorMessage && (
          <TouchableOpacity style={styles.errorBanner} onPress={dismissError}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Text style={styles.errorDismiss}>Tap to dismiss</Text>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <View style={[styles.statusDot, isListening ? styles.dotOn : styles.dotOff]} />
          <Text style={styles.statusLabel}>{STATUS_LABEL[listeningState]}</Text>

          <TouchableOpacity
            style={[styles.bigButton, isListening ? styles.bigButtonStop : styles.bigButtonStart]}
            disabled={isBusy}
            onPress={isListening ? stopListening : startListening}
          >
            <Text style={styles.bigButtonText}>{isListening ? 'Stop Listening' : 'Start Listening'}</Text>
          </TouchableOpacity>

          <View style={styles.meterWrap}>
            <LevelMeter db={currentDb} />
          </View>
        </View>

        {lastEvent && (
          <View style={styles.alertCard}>
            <Text style={styles.alertEmoji}>{CATEGORY_MAP[lastEvent.category].emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{CATEGORY_MAP[lastEvent.category].label} detected</Text>
              <Text style={styles.alertSubtitle}>
                {new Date(lastEvent.timestamp).toLocaleTimeString()} · {Math.round(lastEvent.confidence * 100)}% confidence
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Try a test alert</Text>
          <Text style={styles.sectionHint}>
            Runs a sample sound pattern through the real detector so you can see how an alert looks and feels.
          </Text>
          <View style={styles.testGrid}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity key={c.id} style={styles.testButton} onPress={() => simulateDetection(c.id)}>
                <Text style={styles.testEmoji}>{c.emoji}</Text>
                <Text style={styles.testLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: 4, marginBottom: 20 },
  errorBanner: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontWeight: '600' },
  errorDismiss: { color: colors.danger, fontSize: 12, marginTop: 4, opacity: 0.8 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 8 },
  dotOn: { backgroundColor: colors.success },
  dotOff: { backgroundColor: colors.textMuted },
  statusLabel: { fontSize: 15, color: colors.textMuted, marginBottom: 20 },
  bigButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  bigButtonStart: { backgroundColor: colors.primary },
  bigButtonStop: { backgroundColor: colors.danger },
  bigButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center', paddingHorizontal: 16 },
  meterWrap: { width: '100%' },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  alertEmoji: { fontSize: 30, marginRight: 12 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  alertSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  section: { marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sectionHint: { fontSize: 13, color: colors.textMuted, marginBottom: 14 },
  testGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  testButton: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  testEmoji: { fontSize: 24, marginBottom: 6 },
  testLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
});
