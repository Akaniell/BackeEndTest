export interface Notification {
  id: number;
  userName: string | null;
  dispatchDateTime: string;
  formattedDate: string;  // Добавляем вычисляемое поле
  notificationTypeName: string;
  patternName: string;
  patternDefaultText: string;
  additionalText: string | null;
}

// Дополнительный тип для точного соответствия DTO
export interface Notification_DataDTO {
  id: number;
  userName: string | null;
  dispatchDateTime: string;
  notificationTypeName: string;
  patternName: string;
  patternDefaultText: string;
  additionalText: string | null;
}

export interface Notification_typeDTO {
  id: number;
  name: string;
  mandatory: number;
}

export interface PatternDTO {
  id: number;
  name: string;
  default_text: string;
}

export interface UserDTO {
  userId: string;
  userName: string;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  phoneNumber: string;
}