"use client";

import { useResource } from "~/hooks/useResource";
import * as productsApi from "~/api/productsApi";
import Filters from "~/components/common/table/Filters";
import Table from "~/components/common/table/Table";
import TablePagination from "~/components/common/table/TablePagination";
import { TableProvider } from "~/context/tableContext";
import type { Product } from "~/types/product";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import ProductModal from "~/features/products/components/ProductModal";
import ProductDetailModal from "~/features/products/components/ProductDetailModal";
import ConfirmationModal from "~/components/common/feedback/ConfirmationModal";
import { useEffect, useState } from "react";
import { getCategories } from "~/api/categoryApi";
import type { Category } from "~/types/category";
import { useAuth } from "~/context/authContext";

const columns = [
    { key: "name", label: "PRODUCT" },
    { key: "price", label: "PRICE" },
    { key: "category", label: "CATEGORY" },
    { key: "low_stock_threshold", label: "LOW STOCK THRESHOLD" },
    { key: "quantity", label: "CURRENT QUANTITY" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" }
];

const sortOptions = [
    { label: 'Latest', key: 'created_at', direction: 'descending' },
    { label: 'Oldest', key: 'created_at', direction: 'ascending' },
    { label: 'Name A-Z', key: 'name', direction: 'ascending' },
    { label: 'Name Z-A', key: 'name', direction: 'descending' },
];

export default function Products() {
    const { user } = useAuth();
    const resource = useResource<Product>({
        api: {
            getAll: productsApi.getProducts,
            create: productsApi.createProduct,
            update: productsApi.updateProduct,
            delete: productsApi.deleteProduct,
            audits: productsApi.getAudit,
            get: productsApi.getProduct
        },
        normalizeData: (response: any) => ({
            data: response.data,
            total: response.total
        })
    });

    const tableActions = [
        {
            key: "view",
            label: "View Details",
            icon: <Eye size={18} />,
            onClick: (item: Product) => resource.view.handleView(item),
            isVisible: true // Always viewable
        },
        {
            key: "edit",
            label: "Edit Product",
            icon: <Edit size={18} />,
            onClick: (item: Product) => resource.modal.handleEdit(item),
            isVisible: user?.can?.products?.includes('update')
        },
        {
            key: "delete",
            label: "Delete Product",
            icon: <Trash2 size={18} className="text-danger" />,
            onClick: (item: Product) => resource.delete.handleDelete(item.product_id ?? ""),
            isVisible: user?.can?.products?.includes('delete')
        }
    ].filter(action => action.isVisible !== false);

    const renderCell = (item: Product, columnKey: any) => {
        if (columnKey === "status") {
            const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
                in_stock: "success",
                low_stock: "warning",
                out_of_stock: "danger",
            };
            return (
                <Chip className="capitalize" color={statusColorMap[item.status || ""] || "default"} size="sm" variant="flat" radius="full">
                    {(item.status || "").replaceAll("_", " ")}
                </Chip>
            );
        }
        if (columnKey === "category") {
            return item.category?.name || "-";
        }
        if (columnKey === "brand") {
            return item.brand?.name || "-";
        }
        return undefined;
    };

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then((data) => {
            setCategories(data || []);
        });
    }, []);

    const statusOptions = [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'Low Stock', value: 'low_stock' },
    ];

    return (
        <div className="p-4 flex flex-1 flex-col h-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Management</h1>
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
                isServerSide={true}
                sortOptions={sortOptions}
                refresh={resource.table.refresh}
            >
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <div className="flex gap-2">
                        {user?.can?.products?.includes('create') && (
                            <Button
                                onPress={resource.modal.handleCreate}
                                className="w-fit" size="sm" color="primary"
                                startContent={<Plus size={12}></Plus>}
                            >
                                <span className="hidden md:block">Create Product</span>
                            </Button>
                        )}
                    </div>
                    <Filters />
                </div>

                <ProductModal
                    categories={categories}
                    isOpen={resource.modal.isOpen}
                    onOpenChange={resource.modal.onOpenChange}
                    onClose={resource.modal.onClose}
                    product={resource.modal.selectedItem}
                    onSave={resource.modal.handleSave}
                />

                <ProductDetailModal
                    isOpen={resource.view.isOpen}
                    onOpenChange={resource.view.onOpenChange}
                    onClose={resource.view.onClose}
                    product={resource.view.selectedItem}
                />

                <ConfirmationModal
                    isOpen={resource.delete.isOpen}
                    onOpenChange={resource.delete.onOpenChange}
                    onClose={resource.delete.onClose}
                    onConfirm={resource.delete.onConfirmDelete}
                    title="Delete Product"
                    message={`Are you sure you want to delete this? This action cannot be undone.`}
                    confirmText="Delete"
                />

                <Table actions={tableActions} isLoading={resource.table.isLoading} renderCell={renderCell} />
                <TablePagination />
            </TableProvider>
        </div>
    );
}
