import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_MAP } from '../constants/categories';
import { colors } from '../constants/theme';
import { DetectionEvent } from '../types';

function formatTime(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventRow({ event }: { event: DetectionEvent }) {
  const meta = CATEGORY_MAP[event.category];
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{meta.emoji}</Text>
      <View style={styles.body}>
        <Text style={styles.label}>{meta.label}</Text>
        <Text style={styles.time}>{formatTime(event.timestamp)}</Text>
      </View>
      <Text style={styles.confidence}>{Math.round(event.confidence * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: { fontSize: 28, marginRight: 12 },
  body: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text },
  time: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  confidence: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
