import type { ApiResponse } from '~/types/api';
import ApiService from './baseApi';
import type { Category, PaginatedCategories } from '~/types/category';

export const getCategories = async (params?: any) => {
    const queryParams: Record<string, string> = {
        page: params.page.toString(),
        per_page: params.per_page.toString(),
    };

    if (params.name) {
        queryParams['name'] = params.name;
    }

    if (params.search) {
        queryParams['search'] = params.search;
        queryParams['name'] = params.search;
    }

    if (params.status) {
        queryParams['status'] = params.status;
    }

    if (params.sort_by) {
        queryParams['sort_by'] = 'created_at';
        queryParams['sort_order'] = params.sort_order || 'asc';
    }

    const response: ApiResponse = await ApiService.get('categories', params);
    const data: Category[] = response.data;
    const meta = response.meta as any;

    const result: PaginatedCategories = {
        categories: data,
        total: meta?.total ?? 0,
        perPage: Number(meta?.per_page) ?? 10,
        lastPage: meta?.last_page ?? 1
    };

    return result;
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
    const response: ApiResponse = await ApiService.patch(`categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number | string) => {
    console.log(id);
    const response: ApiResponse = await ApiService.delete(`categories/${id}`);
    return response.data;
};

export const getAudit = async (id: number | string) => {
    const response: ApiResponse = await ApiService.get(`categories/${id}/audits`);
    return response.data;
};
