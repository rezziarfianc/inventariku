
export interface Category {
    category_id: string;
    name: string;
    code: string;
    description: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CategoryFormData {
    name: string;
    code: string;
    description?: string;
}

export interface PaginatedCategories {
    categories: Category[];
    total: number;
    perPage: number;
    lastPage: number;
}