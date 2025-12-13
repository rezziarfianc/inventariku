export type Action = 'create' | 'view' | 'update' | 'delete';

export interface UserPermissions {
    categories: Action[];
    products: Action[];
    supplies: Action[];
    brands: Action[];
}

export interface Audit {
    event: string;
    old_value: object;
    new_value: object;
    created_at: string;
    user: User;
}

export interface User {
    user_id: number | string;
    name: string;
    roles: string[] | null;
    email: string;
    can: UserPermissions | null;
    created_at: string;
    audit: Audit[] | null;
}

export interface AuthData {
    access_token: string;
    token_type: string;
    valid_until: string;
    user: User;
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    perPage: number;
}

export interface UserQueryParams {
    page: number;
    per_page: number;
    name?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    perPage: number;
    lastPage: number;
}

export interface UserFormData {
    name: string;
    role: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UpdateUserFormData {
    name: string;
    role: string;
    email: string;
    password: string;
    password_confirmation: string;
}