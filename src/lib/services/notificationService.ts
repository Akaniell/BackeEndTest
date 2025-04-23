import type { NotificationDTO, Notification } from '$lib/types/notification';
import { formatDateTime } from '$lib/utils/date';

export async function getNotifications(): Promise<Notification[]> {
  const response = await fetch('/notification_datas');
  if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  const data: NotificationDTO[] = await response.json();
  return data.map(dto => ({
    ...dto,
    formattedDate: formatDateTime(dto.dispatchDateTime)
  }));
}
