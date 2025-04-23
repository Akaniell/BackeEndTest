// import { writable } from 'svelte/store';
// import type { Notification, NotificationDTO } from '$lib/types/notification';
// import { getNotifications, formatNotification } from '$lib/services/notificationService';

// interface NotificationStore {
//   items: Notification[];
//   loading: boolean;
//   error: string | null;
// }

// const initialStore: NotificationStore = {
//   items: [],
//   loading: false,
//   error: null,
// };

// export const notifications = writable<NotificationStore>(initialStore);

// export const loadNotifications = async () => {
//   notifications.update(store => ({
//     ...store,
//     loading: true,
//     error: null,
//   }));

//   try {
//     const data: NotificationDTO[] = await getNotifications();
//     const formatted: Notification[] = data.map(formatNotification);
//     notifications.set({
//       items: formatted,
//       loading: false,
//       error: null,
//     });
//   } catch (error) {
//     notifications.update(store => ({
//       ...store,
//       loading: false,
//       error: (error as Error).message,
//     }));
//   }
// };
