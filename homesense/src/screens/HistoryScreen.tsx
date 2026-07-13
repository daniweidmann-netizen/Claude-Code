import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { EventRow } from '../components/EventRow';

export function HistoryScreen() {
  const { events, clearHistory } = useApp();

  const confirmClear = () => {
    Alert.alert('Clear history?', 'This removes all recorded alerts.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alert History</Text>
        {events.length > 0 && (
          <TouchableOpacity onPress={confirmClear}>
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventRow event={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No alerts yet. Start listening from the Home tab.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  clear: { color: colors.danger, fontWeight: '600' },
  list: { padding: 20, paddingTop: 8, flexGrow: 1 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 15, textAlign: 'center', paddingHorizontal: 30 },
});
