"use client";

import { Button, Chip, Spinner, Tab, useDisclosure } from "@heroui/react";
import { ArrowDown, ArrowUp, Plus, RefreshCw } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getSupplies } from "~/apis/stockApi";
import FilterContainer from "~/components/common/newTable/filters/FilterContainer";
import FilterDropdown from "~/components/common/newTable/filters/FilterDropdown";
import FilterSearch from "~/components/common/newTable/filters/FilterSearch";
import FilterSort from "~/components/common/newTable/filters/FilterSort";
import Table from "~/components/common/newTable/Table";
import TablePagination from "~/components/common/newTable/TablePagination";
import CreateStockFlowModal from "~/components/feature/stock/CreateStockFlowModal";
import { useAuth } from "~/contexts/authContext";
import { useTableStore } from "~/contexts/useTableStore";
import { formatDate } from "~/libs/utils";
import type { SupplyFlow } from "~/types/supply";

const columns = [
    { key: "created_at", label: "DATE" },
    { key: "product", label: "ITEM" },
    { key: "flow_type", label: "TYPE" },
    { key: "quantity", label: "QUANTITY" },
    { key: "current_quantity", label: "CURRENT QUANTITY" },
    { key: "user", label: "USER" },
];

const api = {
    get: getSupplies,
    create: () => { },
    update: () => { },
    delete: () => { },
    key: "supplies"
};

const sortOptions = [
    { label: 'Latest', key: 'created_at', direction: 'descending' },
    { label: 'Oldest', key: 'created_at', direction: 'ascending' },
];

const statusOptions = [
    { label: 'All', key: 'flow_type', value: null },
    { label: 'Inbound', key: 'flow_type', value: 'inbound' },
    { label: 'Outbound', key: 'flow_type', value: 'outbound' },
];

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
        return item.created_at ? formatDate(item.created_at) : "-";
    }
    if (columnKey === "product") {
        return (
            <div className="flex flex-col">
                <span className="text-bold text-small capitalize">{item.product?.name} {item.product?.deleted_at ? '(Deleted)' : ''}</span>
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



export default function Stocks() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const { page, limit, filters, sort, fetchData, setSort, setPage, reset } = useTableStore(state => state);
    const navigate = useNavigate();
    const permissions = currentUser?.can?.supplies;
    const isFirstRender = useRef(true);

    const refresh = async (): Promise<void> => {
        setPage(1)
        await fetchData(api)
    }

    //auth checkings
    useEffect(() => {
        if (!authLoading && currentUser && !permissions?.includes('view')) {
            navigate("/");
        }
    }, [currentUser, navigate, authLoading]);

    if (authLoading || (currentUser && !permissions?.includes('view'))) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    useEffect(() => {
        reset();
        setSort(sortOptions[0]);
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        fetchData(api)
    }, [page, limit, filters, sort]);

    // TODO: fix this, to use only the useDisclosure
    const { onOpenChange } = useDisclosure();
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

    return (
        <div className="p-4 flex flex-1 flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Stocks Management</h1>
            <CreateStockFlowModal
                isOpen={isCreateOpen}
                onOpenChange={onOpenChange}
                onClose={() => setIsCreateOpen(false)}
                onSave={refresh}
            />
            <div className="flex items-center justify-between">
                {permissions?.includes('create') && (
                    <Button
                        onPress={() => setIsCreateOpen(true)}
                        className="w-fit" size="sm" color="primary"
                        startContent={<Plus size={12}></Plus>}
                    >
                        <span className="hidden md:block">Create Transaction</span>
                    </Button>
                )}
                <FilterContainer>
                    <FilterSearch />
                    <FilterSort items={sortOptions} />
                    <FilterDropdown items={statusOptions} filterKey="flow_type" />
                    <Button
                        onPress={refresh}
                        isIconOnly
                        className="text-default-500 w-fit"
                        variant="light"
                        size="sm"><RefreshCw size={14} /></Button>
                </FilterContainer>
            </div>
            <Table columns={columns} renderCell={renderCell} />
            <TablePagination />
        </div>
    );
}