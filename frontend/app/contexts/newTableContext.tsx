import { create } from 'zustand';
import type { Sort } from "~/types/common";

interface TableState {
    data: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: Sort;
    filters: Record<string, any>;
    isLoading: boolean;

    // Actions
    setData: (data: any[]) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSort: (sort: Sort) => void;
    setFilter: (key: string, value: any) => void;
    removeFilter: (key: string) => void;
    fetchData: (api: any) => Promise<void>;
}

export const useTableStore = create<TableState>((set, get) => ({
    data: [],
    totalItems: 0,
    page: 1,
    limit: 10,
    sort: { label: '', key: '', direction: 'ascending' },
    filters: {},
    isLoading: false,

    setData: (data) => set({ data }),
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit }),
    setSort: (sort) => set({ sort }),

    setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value }, page: 1 })),

    removeFilter: (key) => set((state) => {
        const newFilters = { ...state.filters };
        delete newFilters[key];
        return { filters: newFilters, page: 1 };
    }),

    fetchData: async (api) => {
        const { page, limit, sort, filters } = get();
        set({ isLoading: true });
        try {
            const sortDir = sort.direction === 'ascending' ? 'asc' : 'desc';
            const response = await api.get({
                page,
                per_page: limit,
                sort_by: sort.key,
                sort_order: sortDir,
                ...filters,
            });
            set({
                data: response[api.key] || [],
                totalItems: response.total || 0,
                isLoading: false
            });
        } catch (error) {
            console.error(error);
            set({ isLoading: false });
        }
    },
}));