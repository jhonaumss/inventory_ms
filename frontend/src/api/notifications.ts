import type { Notification } from "../models/Notification";
import { setupInterceptors } from "./setupInterceptors";

const api = setupInterceptors(() => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data;
};

export const fetchUnreadCount = async (): Promise<number> => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

export const markAllRead = async () => {
  await api.post("/notifications/mark-all-read");
};

export const deleteNotification = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};
