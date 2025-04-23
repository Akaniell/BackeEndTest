export interface NotificationDTO {
  id: number;
  userName: string | null;
  dispatchDateTime: string;
  notificationTypeName: string;
  patternName: string;
  patternDefaultText: string;
  additionalText: string;
}

export interface Notification extends NotificationDTO {
  formattedDate: string;
}
