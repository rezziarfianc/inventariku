import { create } from 'zustand';
import type { Notification } from '~/apis/notificationApi';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    hasFetched: boolean;
    setNotifications: (notifications: Notification[]) => void;
    mergeNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
    setUnreadCount: (count: number) => void;
    incrementUnreadCount: () => void;
    resetUnreadCount: () => void;
    setLoading: (loading: boolean) => void;
    setHasFetched: (fetched: boolean) => void;
    markAllAsReadLocally: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    hasFetched: false,

    setNotifications: (notifications) => set({ notifications }),

    // Merge API notifications with existing ones, keeping real-time notifications that aren't in API yet
    mergeNotifications: (apiNotifications) => set((state) => {
        const apiIds = new Set(apiNotifications.map(n => n.id));
        // Keep real-time notifications (with temp- prefix) that aren't in API response
        const realtimeNotifications = state.notifications.filter(
            n => n.id.startsWith('temp-') && !apiIds.has(n.id)
        );
        // Combine: real-time first, then API notifications
        return {
            notifications: [...realtimeNotifications, ...apiNotifications]
        };
    }),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
    })),

    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
    })),

    clearAllNotifications: () => set({ notifications: [], unreadCount: 0 }),

    setUnreadCount: (count) => set({ unreadCount: count }),

    incrementUnreadCount: () => set((state) => ({
        unreadCount: state.unreadCount + 1
    })),

    resetUnreadCount: () => set({ unreadCount: 0 }),

    setLoading: (loading) => set({ isLoading: loading }),

    setHasFetched: (fetched) => set({ hasFetched: fetched }),

    markAllAsReadLocally: () => set((state) => ({
        notifications: state.notifications.map(n => ({
            ...n,
            read_at: n.read_at || new Date().toISOString()
        }))
    })),
}));