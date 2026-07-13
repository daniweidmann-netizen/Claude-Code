import * as Notifications from 'expo-notifications';
import { CATEGORY_MAP } from '../constants/categories';
import { DetectionEvent } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function notifyDetection(event: DetectionEvent): Promise<void> {
  const meta = CATEGORY_MAP[event.category];
  await Notifications.scheduleNotificationAsync({
    content: {
      title: meta.notificationTitle,
      body: meta.notificationBody,
      sound: true,
    },
    trigger: null,
  });
}
