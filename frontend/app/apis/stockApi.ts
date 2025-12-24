import type { ApiResponse } from '~/types/api';
import ApiService from './baseApi';
import type { PaginatedSupply, SupplyFlow } from '~/types/supply';

export const getSupplies = async (params?: Record<string, string>) => {

    const response: ApiResponse = await ApiService.get('supply', params);
    const meta = response.meta as any;
    const data: SupplyFlow[] = response.data;

    const result: PaginatedSupply = {
        supplies: data,
        total: meta?.total ?? 0,
        perPage: Number(meta?.per_page) ?? 10,
        lastPage: meta?.last_page ?? 1
    };

    return result;
};
