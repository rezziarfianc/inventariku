import moment from "moment"


export const formatDate = (date: string): string => {
    return moment(date).format('DD-MM-YYYY HH:mm:ss');
}

export const formatDateTime = (date: string): string => {
    return moment(date).format('DD MMM YYYY, HH:mm');
}

export const capitalize = (str: string): string => {
    const string = str.replaceAll('_', ' ');
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Formats a date string as a relative time (e.g., "Just now", "5m ago", "2h ago", "3d ago")
 */
export const formatRelativeTime = (dateString: string, locale?: string): string => {
    console.log("Formatting date:", dateString, "with locale:", locale);
    return moment(dateString).locale(locale || 'en').fromNow();
};