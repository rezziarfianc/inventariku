import moment from "moment"


export const formatDate = (date: string): string => {
    return moment(date).format('DD-MM-YYYY HH:mm:ss');
}

export const capitalize = (str: string): string => {
    const string = str.replaceAll('_', ' ');
    return string.charAt(0).toUpperCase() + string.slice(1);
}