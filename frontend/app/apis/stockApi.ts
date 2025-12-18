import type { ApiResponse } from '~/types/api';
import ApiService from './baseApi';

export const getSupplies = async (params?: Record<string, string>) => {
    const response: ApiResponse = await ApiService.get('supply', params);
    return response;
};
