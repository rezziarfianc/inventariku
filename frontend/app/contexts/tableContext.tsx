"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import type { SortDescriptor } from "@heroui/react";

interface TableContextType {
    search: string;
    page: number;
    rowsPerPage: number;
    sortDescriptor: SortDescriptor;
    setSearch: (value: string) => void;
    setPage: (page: number) => void;
    setRowsPerPage: (count: number) => void;
    setSortDescriptor: (sort: SortDescriptor) => void;
    items: any[];
    totalItems: number;
    columns: any[];
    data: any[];
    sortOptions?: { label: string; key: string; direction: string }[];
    statusFilter?: string;
    setStatusFilter?: (value: string) => void;
    statusOptions?: { label: string; value: string }[];
    statusLabel?: string;
    refresh?: () => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

interface TableProviderProps {
    children: React.ReactNode;
    data: any[];
    columns: any[];
    page?: number;
    setPage?: (page: number) => void;
    search?: string;
    setSearch?: (val: string) => void;
    rowsPerPage?: number;
    setRowsPerPage?: (val: number) => void;
    totalItems?: number;
    isServerSide?: boolean;
    sortOptions?: { label: string; key: string; direction: string }[];
    sortDescriptor?: SortDescriptor;
    setSortDescriptor?: (sort: SortDescriptor) => void;
    statusFilter?: string;
    setStatusFilter?: (value: string) => void;
    statusOptions?: { label: string; value: string }[];
    statusLabel?: string;
    refresh?: () => void;
}

export const TableProvider = ({
    children,
    data = [],
    columns = [],
    // Default to internal state if not provided
    page: propPage,
    setPage: propSetPage,
    search: propSearch,
    setSearch: propSetSearch,
    rowsPerPage: propRowsPerPage,
    setRowsPerPage: propSetRowsPerPage,
    totalItems: propTotalItems,
    isServerSide = true,
    sortOptions = [],
    sortDescriptor: propSortDescriptor,
    setSortDescriptor: propSetSortDescriptor,
    statusFilter: propStatusFilter,
    setStatusFilter: propSetStatusFilter,
    statusOptions = [],
    statusLabel = "Status",
    refresh
}: TableProviderProps) => {

    // Internal State (fallback)
    const [internalPage, setInternalPage] = useState(1);
    const [internalSearch, setInternalSearch] = useState("");
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);
    const [internalSortDescriptor, setInternalSortDescriptor] = useState<SortDescriptor>({
        column: "created_at",
        direction: "ascending",
    });
    const [internalStatusFilter, setInternalStatusFilter] = useState("");

    // Use Prop if available, else Internal
    const page = propPage ?? internalPage;
    const setPage = propSetPage ?? setInternalPage;
    const search = propSearch ?? internalSearch;
    const setSearch = propSetSearch ?? setInternalSearch;
    const rowsPerPage = propRowsPerPage ?? internalRowsPerPage;
    const setRowsPerPage = propSetRowsPerPage ?? setInternalRowsPerPage;
    const sortDescriptor = propSortDescriptor ?? internalSortDescriptor;
    const setSortDescriptor = propSetSortDescriptor ?? setInternalSortDescriptor;
    const statusFilter = propStatusFilter ?? internalStatusFilter;
    const setStatusFilter = propSetStatusFilter ?? setInternalStatusFilter;

    const value = {
        search, setSearch,
        page, setPage,
        rowsPerPage, setRowsPerPage,
        sortDescriptor, setSortDescriptor,
        // If ServerSide, show raw data. If ClientSide, show processed slice.
        items: data,
        // If ServerSide, use propTotal. If ClientSide, calc length.
        totalItems: propTotalItems ?? data.length,
        columns,
        data,
        sortOptions,
        statusFilter, setStatusFilter,
        statusOptions,
        statusLabel,
        refresh: refresh || (() => { }),
    };

    return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error("useTableContext must be used within a TableProvider");
    }
    return context;
};