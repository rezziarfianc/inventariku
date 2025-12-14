import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination, Spinner } from "@heroui/react";
import { useEffect, useMemo, useCallback } from "react";
import { getSupplies } from "~/api/stockApi";
import { useTableData } from "~/hooks/useTableData";
import type { SupplyFlow } from "~/types/supply";
import moment from "moment";

interface TransactionTableProps {
    filter: Record<string, any> | null;
}

const columns = [
    { name: "DATE", uid: "created_at" },
    { name: "PRODUCT", uid: "product" },
    { name: "TYPE", uid: "flow_type" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "USER", uid: "user" },
];

export default function TransactionTable({ filter }: TransactionTableProps) {

    //adapt the useTableData fetch function
    const fetchSuppliesAdapter = useCallback(async (params: any) => {
        const query = { ...params, ...filter };
        const response = await getSupplies(query);

        const data = response.data || [];
        const total = (response.meta as any)?.total || 0;

        return { data, total };
    }, [filter]);

    const {
        items,
        isLoading,
        sortDescriptor,
        setSortDescriptor,
        page,
        setPage,
        totalItems,
        rowsPerPage,
        refresh
    } = useTableData<SupplyFlow>({
        fetchData: fetchSuppliesAdapter,
        initialSort: { column: "created_at", direction: "descending" }
    });

    // Calculate pages manually since hook returns totalItems
    const pages = useMemo(() => {
        return totalItems > 0 ? Math.ceil(totalItems / rowsPerPage) : 0;
    }, [totalItems, rowsPerPage]);

    // Refresh data when filter changes
    useEffect(() => {
        refresh();
    }, [filter, refresh]);

    const renderCell = (item: SupplyFlow, columnKey: React.Key) => {
        const cellValue = item[columnKey as keyof SupplyFlow];

        switch (columnKey) {
            case "created_at":
                return (
                    <div className="flex flex-col">
                        <span className="text-bold text-small capitalize">{moment.utc(item.created_at).format("DD MMM YYYY, HH:mm")}</span>
                    </div>
                );
            case "product":
                return (
                    <div className="flex flex-col">
                        <span className="text-bold text-small capitalize">{item.product?.name}</span>
                        <span className="text-tiny text-default-400">{item.product?.category?.name}</span>
                    </div>
                );
            case "flow_type":
                return (
                    <Chip className="capitalize" color={item.flow_type === "inbound" ? "success" : "danger"} size="sm" variant="flat">
                        {item.flow_type}
                    </Chip>
                );
            case "user":
                return (
                    <span className="text-small">{item.latest_audit?.user?.name || "-"}</span>
                );
            default:
                return cellValue as React.ReactNode;
        }
    };

    return (
        <div className="w-full">
            <Table
                aria-label="Transaction table"
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-end">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                shadow="none"
                radius="none"
                classNames={{
                    wrapper: "shadow-none",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={items} loadingContent={<Spinner />} isLoading={isLoading} emptyContent={"No transactions found"}>
                    {(item) => (
                        <TableRow key={item.supply_flow_id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
