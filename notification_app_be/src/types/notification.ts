export type NotificationType = 'Placement' | 'Result' | 'Event' | 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  studentID?: number;
  createdAt: string;
  read: boolean;
}

export interface ExternalNotification {
  id?: string | number;
  title?: string;
  message?: string;
  type?: string;
  studentID?: number;
  studentId?: number;
  createdAt?: string;
  timestamp?: string;
  isRead?: boolean;
  read?: boolean;
}

export interface PriorityNotification extends Notification {
  score: number;
  rank: number;
}
