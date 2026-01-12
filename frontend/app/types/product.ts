export interface Audit {
    event: string;
    old_value: object;
    new_value: object;
    created_at: string;
    user: { name: string };
}

export interface Product {
    id: number;
    name: string;
    price: number;
    category?: { id: number; name: string };
    brand?: { id: number; name: string };
    image?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    product_id?: number | string;
    audit?: Audit[];
    status?: string;
    quantity?: number;
    low_stock_threshold?: number;
    category_id?: string | number;
    deleted_at?: string | null | undefined;
}

export interface ProductFormData {
    name: string;
    price: number;
    quantity: number;
    category_id?: string | number;
    brand_id?: string | number;
    description?: string;
    low_stock_threshold?: number;
}

export interface ProductQueryParams {
    page: number;
    category?: number;
    per_page: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    status?: string;
}

export interface PaginatedProducts {
    products: Product[];
    total: number;
    per_page: number;
    last_page: number;
    current_page: number;
}
