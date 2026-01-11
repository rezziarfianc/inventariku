import { addToast, Badge, Button, Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import { useEchoPublic } from "@laravel/echo-react";
import { Bell, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/contexts/authContext";
import { useNotificationStore } from "~/contexts/useNotificationStore";
import { getNotifications, getUnreadCount, markAllAsRead, deleteNotification, type Notification } from "~/apis/notificationApi";
import { formatRelativeTime } from "~/libs/utils";
import "~/libs/echo";


export default function NotificationDropdown() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        isLoading,
        hasFetched,
        mergeNotifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        setUnreadCount,
        resetUnreadCount,
        setLoading,
        setHasFetched,
        markAllAsReadLocally,
    } = useNotificationStore();

    // Fetch unread count on mount
    useEffect(() => {
        if (user) {
            fetchUnreadCount();
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const fetchNotifications = useCallback(async () => {
        if (isLoading) return;

        setLoading(true);
        try {
            const result = await getNotifications({
                page: 1,
                per_page: 20,
                sort_by: 'created_at',
                sort_order: 'desc',
            });
            // merge incoming notifications with existing ones
            mergeNotifications(result.notifications);
            setHasFetched(true);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [isLoading, mergeNotifications, setLoading, setHasFetched]);

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (open) {
            // Fetch notifications if not already fetched
            if (!hasFetched) {
                await fetchNotifications();
            }

            // Mark all as read when opening
            if (unreadCount > 0) {
                try {
                    await markAllAsRead();
                    resetUnreadCount();
                    markAllAsReadLocally();
                } catch (error) {
                    console.error('Failed to mark notifications as read:', error);
                }
            }
        }
    };

    const handleDismiss = async (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            // if (!notificationId.startsWith('temp-')) {
            //     await deleteNotification(notificationId);
            // }
            removeNotification(notificationId);
        } catch (error) {
            console.error('Failed to dismiss notification:', error);
        }
    };

    const handleDismissAll = async () => {
        try {
            const nonTempNotifications = notifications.filter(n => !n.id.startsWith('temp-'));
            await Promise.all(nonTempNotifications.map(n => deleteNotification(n.id)));
            clearAllNotifications();
        } catch (error) {
            console.error('Failed to dismiss all notifications:', error);
        }
    };

    // Subscribe to public notifications channel for NotificationEvent
    const NotificationListener = () => {
        useEchoPublic(
            `notifications.${user?.user_id}`,
            '.NotificationEvent',
            (event: any) => {
                const notification: Notification = {
                    id: event.id || `temp-${Date.now()}`,
                    type: event.type || 'unknown',
                    message: event.message || '',
                    data: event,
                    read_at: null,
                    created_at: event.sent_at || new Date().toISOString(),
                };

                addNotification(notification);

                addToast({
                    title: "New Notification",
                    description: event.message || 'You have a new notification',
                    color: 'default',
                    icon: <Bell size={20} />,
                    timeout: 3000,
                });
            }
        );
        return null;
    };

    return (
        <div>
            {user && <NotificationListener />}
            <Popover
                placement="bottom-end"
                isOpen={isOpen}
                onOpenChange={handleOpenChange}
            >
                <PopoverTrigger>
                    <Button isIconOnly variant="light" className="ml-4">
                        <Badge
                            size="sm"
                            color="danger"
                            content={unreadCount}
                            className="cursor-pointer"
                            isInvisible={unreadCount === 0}
                        >
                            <Bell size={20} />
                        </Badge>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80">
                    <div className="flex flex-col w-full">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 text-center">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                        </div>

                        {/* Scrollable notification list */}
                        <div className="max-h-80 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Spinner size="sm" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2">
                                                    {!notification.read_at && (
                                                        <span className="w-2 h-2 mt-1.5 bg-red-500 rounded-full flex-shrink-0" />
                                                    )}
                                                    <span className={`${!notification.read_at ? "font-medium" : ""} text-sm line-clamp-2`}>
                                                        {notification.message}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatRelativeTime(notification.created_at)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleDismiss(e, notification.id)}
                                                className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                                                title="Dismiss"
                                            >
                                                <X size={14} className="text-gray-400 hover:text-gray-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fixed footer - Dismiss All button */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-200">
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="light"
                                    className="w-full"
                                    onPress={handleDismissAll}
                                >
                                    Dismiss All
                                </Button>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}