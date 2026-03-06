export type NotificationType = "WARNING" | "CRITICAL" | "INFO";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
};
