import type { PaginatedUsers, User, UserFormData, UserQueryParams } from '~/types/user';
import ApiService from './baseApi';
import type { ApiResponse } from '~/types/api';


export const getUser = async (user_id: string | number) => {
    const response: ApiResponse = await ApiService.get('users/' + user_id);
    const data: User[] = response.data;

    return data;
}

export const getAudit = async (user_id: string | number) => {
    const response: ApiResponse = await ApiService.get('users/' + user_id + '/audits/');
    return response.data;
}

export const createUser = async (formData: UserFormData) => {
    const response: ApiResponse = await ApiService.post('users', formData);
    return response.data;
}

export const updateUser = async (user_id: string | number, formData: UserFormData) => {
    const response: ApiResponse = await ApiService.put('users/' + user_id, formData);
    return response.data;
}

export const deleteUser = async (user_id: string | number) => {
    const response: ApiResponse = await ApiService.delete('users/' + user_id);
    return response.data;
}

export const getUsers = async (params: UserQueryParams) => {
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

    if (params.sort_by) {
        queryParams['sort_by'] = 'created_at';
        queryParams['sort_order'] = params.sort_order || 'asc';
    }

    const response: ApiResponse = await ApiService.get('users', queryParams);

    const meta = response.meta as any;
    const data: User[] = response.data;

    const result: PaginatedUsers = {
        users: data,
        total: meta?.total ?? 0,
        perPage: Number(meta?.per_page) ?? 10,
        lastPage: meta?.last_page ?? 1
    };

    return result;
}