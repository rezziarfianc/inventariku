import ApiService, { type ApiResponse } from './baseApi';

export const getSupplies = async (params?: Record<string, string>) => {
    const response: ApiResponse = await ApiService.get('supply', params);
    return response.data;
};
