import type { Notification, Notification_DataDTO, Notification_typeDTO, PatternDTO, UserDTO } from '$lib/types/notification';

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
      dispatchDateTime: 'dispatchDateTime',
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
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }

    const data: Notification_DataDTO[] = await response.json();

    return data.map((item) => ({
      ...item,
      dispatchDateTime: new Date(item.dispatchDateTime)  
    }));
  } catch (error) {
    throw new Error(`Не удалось загрузить уведомления. ${error}`);
  }
};

export const deleteNotification = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/notification_datas/delete/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Ошибка! Статус: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Не удалось удалить уведомление. ${error}`);
  }
};

export async function getNotificationTypes(): Promise<Notification_typeDTO[]> {
  const res = await fetch(`/notification_types`);
  if (!res.ok) throw new Error(`Не удалось загрузить уведомления. ${res.status}`);
  return res.json();
}

export async function getPatterns(): Promise<PatternDTO[]> {
  const res = await fetch(`/patterns`);
  if (!res.ok) throw new Error(`Не удалось загрузить шаблоны. ${res.status}`);
  return res.json();
}

export async function getUsers(): Promise<UserDTO[]> {
  const res = await fetch(`/users`);
  if (!res.ok) throw new Error(`Не удалось загрузить пользователей. ${res.status}`);
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
    throw new Error(`Не удалось создать уведомление: ${res.status}`);
  }
  const text = await res.text();
  if (text) {
    return JSON.parse(text);
  } else {
    return null;
  }
}