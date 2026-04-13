export const isNotificationSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window;

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported' as const;
  return Notification.requestPermission();
};

export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  new Notification(title, options);
  return true;
};

