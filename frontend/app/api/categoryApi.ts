import ApiService, { type ApiResponse } from './baseApi';

export const getCategories = async () => {
    const response: ApiResponse = await ApiService.get('categories');
    return response.data;
};

export const getCategory = async (id: number | string) => {
    const response: ApiResponse = await ApiService.get(`categories/${id}`);
    return response.data;
};

export const createCategory = async (data: any) => {
    const response: ApiResponse = await ApiService.post('categories', data);
    return response.data;
};

export const updateCategory = async (id: number | string, data: any) => {
    const response: ApiResponse = await ApiService.put(`categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number | string) => {
    const response: ApiResponse = await ApiService.delete(`categories/${id}`);
    return response.data;
};

export const getAudit = async (id: number | string) => {
    const response: ApiResponse = await ApiService.get(`categories/${id}/audits`);
    return response.data;
};
