import type { ApiResponse } from '~/types/api';
import ApiService from './baseApi';

export interface Notification {
    id: string;
    type: string;
    message: string;
    data: Record<string, any>;
    read_at: string | null;
    created_at: string;
}

export interface PaginatedNotifications {
    notifications: Notification[];
    total: number;
    perPage: number;
    lastPage: number;
}

export interface UnreadCountResponse {
    count: number;
}

export const getNotifications = async (params?: {
    page?: number;
    per_page?: number;
    unread_only?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}): Promise<PaginatedNotifications> => {
    const queryParams: Record<string, string> = {
        page: (params?.page ?? 1).toString(),
        per_page: (params?.per_page ?? 20).toString(),
        sort_by: params?.sort_by ?? 'created_at',
        sort_order: params?.sort_order ?? 'desc',
    };

    if (params?.unread_only) {
        queryParams['unread_only'] = 'true';
    }

    const response: ApiResponse<Notification[]> = await ApiService.get('notifications', queryParams);
    const data: Notification[] = response.data;
    const meta = response.meta as any;

    return {
        notifications: data,
        total: meta?.total ?? 0,
        perPage: Number(meta?.per_page) ?? 20,
        lastPage: meta?.last_page ?? 1,
    };
};

export const getUnreadCount = async (): Promise<number> => {
    const response: ApiResponse<UnreadCountResponse> = await ApiService.get('notifications/unread-count');
    return response.data.count;
};

export const markAllAsRead = async (): Promise<void> => {
    await ApiService.post('notifications/mark-all-read');
};

export const markAsRead = async (id: string): Promise<void> => {
    await ApiService.post(`notifications/${id}/mark-read`);
};

export const deleteNotification = async (id: string): Promise<void> => {
    await ApiService.delete(`notifications/${id}`);
};
