import type { SortDescriptor } from "@heroui/react";

// Define types for common API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UseResourceProps<T> {
    api: {
        getAll: (params: any) => Promise<any>;
        get: (id: string | number) => Promise<any>;
        audits: (id: string | number) => Promise<any>;
        create: (data: any) => Promise<any>;
        update: (id: string | number, data: any) => Promise<any>;
        delete: (id: string | number) => Promise<any>;
    };
    normalizeData?: (data: any) => { data: T[]; total: number }; // Optional mapper
    defaultSort?: SortDescriptor;
}