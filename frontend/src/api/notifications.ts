import type { Notification } from "../models/Notification";
import { setupInterceptors } from "./setupInterceptors";

const api = setupInterceptors(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
});

export const fetchNotifications = async (): Promise<Notification[]> => {
  const userId = localStorage.getItem("userId");
  const res = await api.get(`/notifications/${userId}`);
  return res.data;
};

export const fetchUnreadCount = async (): Promise<number> => {
  const userId = localStorage.getItem("userId");
  const res = await api.get(`/notifications/${userId}/unread-count`);
  return res.data;
};

export const markAllRead = async () => {
  const userId = localStorage.getItem("userId");
  await api.post(`/notifications/${userId}/mark-all-read`);
};

export const deleteNotification = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};
