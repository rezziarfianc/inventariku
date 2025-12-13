import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { SortDescriptor } from "@heroui/react";

interface UseTableDataProps<T> {
    fetchData: (params: any) => Promise<{ data: T[]; total: number }>;
    initialSort?: SortDescriptor;
    initialRowsPerPage?: number;
}

export function useTableData<T>({
    fetchData,
    initialSort = { column: "created_at", direction: "descending" },
    initialRowsPerPage = 10,
}: UseTableDataProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(initialSort);
    const [statusFilter, setStatusFilter] = useState("");

    const fetchDataRef = useRef(fetchData);

    useEffect(() => {
        fetchDataRef.current = fetchData;
    }, [fetchData]);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchDataRef.current({
                page,
                per_page: rowsPerPage,
                search,
                sort_by: sortDescriptor.column,
                sort_order: sortDescriptor.direction === "ascending" ? "asc" : "desc",
                status: statusFilter,
            });
            setData(result.data);
            setTotalItems(result.total);
        } catch (error) {
            console.error("Failed to fetch table data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, search, sortDescriptor, statusFilter]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        items: data,
        totalItems,
        isLoading,
        page,
        rowsPerPage,
        search,
        sortDescriptor,
        setPage,
        setRowsPerPage,
        setSearch,
        setSortDescriptor,
        statusFilter,
        setStatusFilter,
        refresh,
    };
}
