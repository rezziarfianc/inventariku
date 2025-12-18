import type { ApiResponse } from "~/types/api";
import ApiService from "./baseApi";

export const getAnalytics = async (params?: any) => {
    const response: ApiResponse = await ApiService.get('analytics/dashboard', params);
    return response;
};
