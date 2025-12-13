import type { PaginatedProducts, Product, ProductFormData, ProductQueryParams } from '~/types/product';
import ApiService, { type ApiResponse } from './baseApi';

export const getProducts = async (params: ProductQueryParams) => {
    const queryParams: Record<string, string> = {
        page: params.page.toString(),
        per_page: params.per_page.toString(),
    };

    if (params.search) {
        queryParams['search'] = params.search;
    }

    if (params.sort_by) {
        queryParams['sort_by'] = params.sort_by;
        queryParams['sort_order'] = params.sort_order || 'asc';
    }

    if (params.status) {
        queryParams['stock_status'] = params.status;
    }

    const response: ApiResponse = await ApiService.get('products', queryParams);

    // Normalize response if needed, consistent with usersApi
    const meta = response.meta as any;

    const result: PaginatedProducts = {
        data: response.data as Product[],
        total: meta?.total ?? 0,
        per_page: Number(meta?.per_page) ?? 10,
        last_page: meta?.last_page ?? 1,
        current_page: meta?.current_page ?? 1
    };

    return result;
}

export const getProduct = async (id: number | string) => {
    const response: ApiResponse = await ApiService.get(`products/${id}`);
    return response.data;
}

export const createProduct = async (data: ProductFormData) => {
    const response: ApiResponse = await ApiService.post('products', data);
    return response.data;
}

export const updateProduct = async (id: number | string, data: ProductFormData) => {
    const response: ApiResponse = await ApiService.put(`products/${id}`, data);
    return response.data;
}

export const deleteProduct = async (id: number | string) => {
    const response: ApiResponse = await ApiService.delete(`products/${id}`);
    return response.data;
}

export const getAudit = async (id: number | string) => {
    const response: ApiResponse = await ApiService.get(`products/${id}/audits`);
    return response.data;
}
