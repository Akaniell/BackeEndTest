import type { Notification, Notification_typeDTO, PatternDTO, UserDTO } from '$lib/types/notification';

export const getNotifications = async (
	sortField?: keyof Notification,
	sortDirection?: 'asc' | 'desc'
): Promise<Notification[]> => {
	try {
		const params = new URLSearchParams();

		const fieldMapping: Record<string, string> = {
			notificationTypeName: 'notificationTypeName',
			patternName: 'patternName',
			userName: 'userName',
			formattedDate: 'dispatchDateTime',
			patternDefaultText: 'patternDefaultText',
			additionalText: 'additionalText',
			id: 'id'
		};

		if (sortField && fieldMapping[sortField]) {
			params.append('sortBy', fieldMapping[sortField]);
			params.append('isDescending', sortDirection === 'desc' ? 'true' : 'false');
		}

		const response = await fetch(`/notification_datas?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		return data.map((item: any) => ({
			...item,
			formattedDate: new Date(item.dispatchDateTime).toLocaleString()
		}));
	} catch (error) {
		console.error('Ошибка при загрузке уведомлений:', error);
		throw new Error('Не удалось загрузить уведомления');
	}
};

export const deleteNotification = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/notification_datas/delete/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error);
    throw new Error('Не удалось удалить уведомление');
  }
};

export async function getNotificationTypes(): Promise<Notification_typeDTO[]> {
  const res = await fetch(`/notification_types`);
  if (!res.ok) throw new Error('Failed to fetch notification types');
  return res.json();
}

export async function getPatterns(): Promise<PatternDTO[]> {
  const res = await fetch(`/patterns`);
  if (!res.ok) throw new Error('Failed to fetch patterns');
  return res.json();
}

export async function getUsers(): Promise<UserDTO[]> {
  const res = await fetch(`/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createNotification(data: {
  userName?: string;
  notificationTypeName: string;
  patternName: string;
  additionalText: string;
}) {
  const res = await fetch(`/notification_datas/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create notification error:', errorText);
    throw new Error(`Failed to create notification: ${res.status}`);
  }
  const text = await res.text();
  if (text) {
    return JSON.parse(text);
  } else {
    return null; // или undefined, если сервер не возвращает тело
  }
}