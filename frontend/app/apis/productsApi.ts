import type { PaginatedProducts, Product, ProductFormData, ProductQueryParams } from '~/types/product';
import ApiService from './baseApi';
import type { ApiResponse } from '~/types/api';

export const getProducts = async (params: ProductQueryParams) => {
    const queryParams: Record<string, string> = {
        page: (params.page || 1).toString(),
        per_page: (params.per_page || 10).toString(),
    };

    if (params.search) {
        queryParams['search'] = params.search;
    }

    // Cast parameter to any to access custom properties like product_name until type definition is updated
    const customParams = params as any;
    if (customParams.product_name) {
        queryParams['product_name'] = customParams.product_name;
    }

    if (params.sort_by) {
        queryParams['sort_by'] = params.sort_by;
        queryParams['sort_order'] = params.sort_order || 'asc';
    }

    if (params.status) {
        queryParams['stock_status'] = params.status;
    }

    if (params.category) {
        queryParams['category_id'] = params.category.toString();
    }

    const response: ApiResponse = await ApiService.get('products', queryParams);

    // Normalize response if needed, consistent with usersApi
    const meta = response.meta as any;

    const result: PaginatedProducts = {
        products: response.data as Product[],
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
    const response: ApiResponse = await ApiService.patch(`products/${id}`, data);
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

export const manageStock = async (productId: number | string, quantity: number, flowType: 'inbound' | 'outbound') => {
    const response: ApiResponse = await ApiService.post('supply', {
        product_id: productId,
        quantity: quantity,
        flow_type: flowType
    });
    return response.data;
}

export const getSupplyFlows = async (params: { product_id: number | string, per_page?: number }) => {
    const response: ApiResponse = await ApiService.get('supply', {
        product_id: params.product_id?.toString(),
        per_page: (params.per_page || 5).toString()
    });
    return response.data;
}
