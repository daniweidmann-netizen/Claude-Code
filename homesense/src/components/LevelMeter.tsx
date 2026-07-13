import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

interface Props {
  db: number | null;
}

// Maps a dBFS reading (-160..0) onto a 0..1 fill for a simple level bar.
function levelFromDb(db: number | null): number {
  if (db === null) return 0;
  const clamped = Math.max(-60, Math.min(0, db));
  return (clamped + 60) / 60;
}

export function LevelMeter({ db }: Props) {
  const level = levelFromDb(db);
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.round(level * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});
