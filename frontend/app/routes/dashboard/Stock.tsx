"use client";

import { useResource } from "~/hooks/useResource";
import * as stockApi from "~/api/stockApi";
import Filters from "~/components/common/table/Filters";
import Table from "~/components/common/table/Table";
import TablePagination from "~/components/common/table/TablePagination";
import { TableProvider } from "~/context/tableContext";
import type { SupplyFlow } from "~/types/supply";
import { Chip, Spinner } from "@heroui/react";
import moment from "moment";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import CreateStockFlowModal from "~/features/stock/components/CreateStockFlowModal";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useAuth } from "~/context/authContext";

const columns = [
    { key: "created_at", label: "DATE" },
    { key: "product", label: "PRODUCT" },
    { key: "flow_type", label: "TYPE" },
    { key: "quantity", label: "QUANTITY" },
    { key: "current_quantity", label: "CURRENT QUANTITY" },
    { key: "user", label: "USER" },
];

const sortOptions = [
    { label: 'Latest', key: 'created_at', direction: 'descending' },
    { label: 'Oldest', key: 'created_at', direction: 'ascending' },
];

const statusOptions = [
    { label: 'Inbound', value: 'inbound' },
    { label: 'Outbound', value: 'outbound' },
];

import { useNavigate } from "react-router";

export default function Stock() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user && !user.can?.supplies?.includes('view')) {
            navigate("/");
        }
    }, [user, navigate, authLoading]);

    if (authLoading || (user && !user.can?.supplies?.includes('view'))) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const resource = useResource<SupplyFlow>({
        api: {
            getAll: async (params) => {
                const { status, search, ...rest } = params || {};
                const queryParams: any = { ...rest };
                if (status) {
                    queryParams.flow_type = status;
                }
                if (search) {
                    queryParams.product_name = search;
                }
                return stockApi.getSupplies(queryParams);
            },
            create: async () => { },
            update: async () => { },
            delete: async () => { },
            get: async () => null,
            audits: async () => [],
        },
        normalizeData: (response: any) => {
            if (Array.isArray(response)) {
                return {
                    data: response,
                    total: response.length
                };
            }
            return {
                data: response.data || [],
                total: response.meta?.total || response.total || 0
            };
        },
        defaultSort: {
            column: sortOptions[0].key,
            direction: sortOptions[0].direction as "ascending" | "descending"
        }
    });

    const renderCell = (item: SupplyFlow, columnKey: any) => {
        if (columnKey === "user") {
            return (
                <div className="flex flex-col">
                    <span className="text-bold text-small capitalize">{item.latest_audit?.user?.name || "System"}</span>
                    <span className="text-tiny text-default-400">{item.latest_audit?.user?.email}</span>
                </div>
            );
        }
        if (columnKey === "created_at") {
            return item.created_at ? moment(item.created_at).format("DD MMM YYYY HH:mm") : "-";
        }
        if (columnKey === "product") {
            return (
                <div className="flex flex-col">
                    <span className="text-bold text-small capitalize">{item.product?.name}</span>
                </div>
            );
        }
        if (columnKey === "flow_type") {
            const isOutbound = item.flow_type === "outbound";
            return (
                <Chip
                    className="capitalize gap-1 border-small border-white/50 shadow-pink-500/30"
                    color={isOutbound ? "danger" : "success"}
                    size="sm"
                    variant="flat"
                    startContent={isOutbound ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                >
                    {item.flow_type}
                </Chip>
            );
        }
        if (columnKey === "quantity") {
            const isOutbound = item.flow_type === "outbound";
            return (
                <div className={`flex items-center gap-1 ${isOutbound ? 'text-danger' : 'text-success'}`}>
                    {isOutbound ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                    <span className="font-semibold">{item.quantity}</span>
                </div>
            )
        }
        if (columnKey === "current_quantity") {
            return item.product?.quantity || "-";
        }
        return undefined;
    };

    return (
        <div className="p-4 flex flex-1 flex-col h-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Stock Flow</h1>
            <TableProvider
                data={resource.table.items}
                totalItems={resource.table.totalItems}
                columns={columns}
                page={resource.table.page} setPage={resource.table.setPage}
                rowsPerPage={resource.table.rowsPerPage} setRowsPerPage={resource.table.setRowsPerPage}
                search={resource.table.search} setSearch={resource.table.setSearch}
                sortDescriptor={resource.table.sortDescriptor} setSortDescriptor={resource.table.setSortDescriptor}
                statusFilter={resource.table.statusFilter} setStatusFilter={resource.table.setStatusFilter}
                statusOptions={statusOptions}
                statusLabel="Flow Type"
                isServerSide={true}
                sortOptions={sortOptions}
                refresh={resource.table.refresh}
            >
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <div className="flex gap-2">
                        {user?.can?.supplies?.includes('create') && (
                            <Button
                                onPress={() => setIsCreateModalOpen(true)}
                                className="w-fit" size="sm" color="primary"
                                startContent={<Plus size={12}></Plus>}
                            >
                                <span className="hidden md:block">Create Transaction</span>
                            </Button>
                        )}
                    </div>
                    <Filters />
                </div>

                <CreateStockFlowModal
                    isOpen={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={async () => {
                        await resource.table.refresh();
                    }}
                />

                <Table isLoading={resource.table.isLoading} renderCell={renderCell} />
                <TablePagination />
            </TableProvider>
        </div>
    );
}
