import { useEffect, useState, useRef } from "react";
import { FiBell, FiAlertTriangle, FiCheckCircle, FiTrash } from "react-icons/fi";
import {
  NotificationBellWrapper,
  NotificationDot,
  NotificationDropdown,
  NotificationHeader,
  NotificationList,
  NotificationItem,
  NotificationIconBadge,
  NotificationTextWrapper,
  NotificationTitle,
  NotificationMessage,
  NotificationTime,
  NotificationDeleteButton,
  NotificationFooter,
  NotificationFooterLink,
} from "./StyledComponents";
import type { Notification } from "../models/Notification";
import { toast } from "react-toastify";
import {  fetchNotifications, fetchUnreadCount, markAllRead, deleteNotification } from "../api/notifications";

const formatTimeAgo = (iso: string) => {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Hace unos segundos";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
};

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const count = await fetchUnreadCount();
        setUnreadCount(count);
      } catch {
        // opcional: toast.warning("No se pudieron cargar las notificaciones");
      }
    };
    loadUnread();
  }, []);

  // cerrar dropdown si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      try {
        const list = await fetchNotifications();
        setNotifications(list);
        await markAllRead();
        setUnreadCount(0);
      } catch {
        toast.error("No se pudieron cargar las notificaciones");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("No se pudo eliminar la notificación");
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", marginRight: "1rem" }}>
      <NotificationBellWrapper onClick={handleToggle} aria-label="Notificaciones">
        <FiBell size={20} color="#000000"/>
        {unreadCount > 0 && <NotificationDot />}
      </NotificationBellWrapper>

      {open && (
        <NotificationDropdown>
          <NotificationHeader>Notificaciones</NotificationHeader>

          <NotificationList>
            {notifications.length === 0 ? (
              <NotificationItem>
                <NotificationTextWrapper>
                  <NotificationTitle>Sin notificaciones</NotificationTitle>
                  <NotificationMessage>No tienes notificaciones pendientes.</NotificationMessage>
                </NotificationTextWrapper>
              </NotificationItem>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n.id}>
                  <NotificationIconBadge type={n.type}>
                    {n.type === "CRITICAL" ? (
                      <FiAlertTriangle size={15}/>
                    ) : n.type === "WARNING" ? (
                      "!"
                    ) : (
                      <FiCheckCircle size={15}/>
                    )}
                  </NotificationIconBadge>
                  <NotificationTextWrapper>
                    <NotificationTitle>{n.title}</NotificationTitle>
                    <NotificationMessage>{n.message}</NotificationMessage>
                    <NotificationTime>{formatTimeAgo(n.createdAt)}</NotificationTime>
                  </NotificationTextWrapper>
                  <NotificationDeleteButton
                    type="button"
                    onClick={() => handleDelete(n.id)}
                    aria-label="Eliminar notificación"
                  >
                    <FiTrash size={20}/>
                  </NotificationDeleteButton>
                </NotificationItem>
              ))
            )}
          </NotificationList>

          <NotificationFooter>
            <NotificationFooterLink onClick={() => setOpen(false)}>
              Cerrar
            </NotificationFooterLink>
          </NotificationFooter>
        </NotificationDropdown>
      )}
    </div>
  );
};
