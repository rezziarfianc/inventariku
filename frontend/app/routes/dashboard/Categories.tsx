"use client";
import { useEffect } from "react";

import { useResource } from "~/hooks/useResource";
import * as categoryApi from "~/api/categoryApi";
import Filters from "~/components/common/table/Filters";
import Table from "~/components/common/table/Table";
import TablePagination from "~/components/common/table/TablePagination";
import { TableProvider } from "~/context/tableContext";
import type { Category } from "~/types/category";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button, Spinner } from "@heroui/react";
import CategoryModal from "~/components/feature/categories/CategoryModal";
import CategoryDetailModal from "~/components/feature/categories/CategoryDetailModal";
import ConfirmationModal from "~/components/common/feedback/ConfirmationModal";
import moment from "moment";
import { useAuth } from "~/context/authContext";

const columns = [
    { key: "name", label: "CATEGORY NAME" },
    { key: "code", label: "CODE" },
    { key: "description", label: "DESCRIPTION" },
    { key: "created_at", label: "CREATED AT" },
    { key: "actions", label: "ACTIONS" }
];

const sortOptions = [
    { label: 'Latest', key: 'created_at', direction: 'descending' },
    { label: 'Oldest', key: 'created_at', direction: 'ascending' },
    { label: 'Name A-Z', key: 'name', direction: 'ascending' },
    { label: 'Name Z-A', key: 'name', direction: 'descending' },
];

import { useNavigate } from "react-router";

export default function Categories() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user && !user.can?.categories?.includes('view')) {
            navigate("/");
        }
    }, [user, navigate, authLoading]);

    if (authLoading || (user && !user.can?.categories?.includes('view'))) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }
    const resource = useResource<Category>({
        api: {
            getAll: categoryApi.getCategories,
            create: categoryApi.createCategory,
            update: categoryApi.updateCategory,
            delete: categoryApi.deleteCategory,
            audits: categoryApi.getAudit,
            get: categoryApi.getCategory
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
        }
    });

    const tableActions = [
        {
            key: "view",
            label: "View Details",
            icon: <Eye size={18} />,
            onClick: (item: Category) => resource.view.handleView(item),
            isVisible: true
        },
        {
            key: "edit",
            label: "Edit Category",
            icon: <Edit size={18} />,
            onClick: (item: Category) => resource.modal.handleEdit(item),
            isVisible: user?.can?.categories?.includes('update')
        },
        {
            key: "delete",
            label: "Delete Category",
            icon: <Trash2 size={18} className="text-danger" />,
            onClick: (item: Category) => resource.delete.handleDelete(item.category_id),
            isVisible: user?.can?.categories?.includes('delete')
        }
    ].filter(action => action.isVisible !== false);

    const renderCell = (item: Category, columnKey: any) => {
        if (columnKey === "created_at") {
            return item.created_at ? moment(item.created_at).format("DD MMM YYYY") : "-";
        }
        if (columnKey === "description") {
            return (
                <div className="max-w-xs truncate text-default-500">
                    {item.description || "-"}
                </div>
            );
        }
        return undefined;
    };

    return (
        <div className="p-4 flex flex-1 flex-col h-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Management</h1>
            <TableProvider
                data={resource.table.items}
                totalItems={resource.table.totalItems}
                columns={columns}
                page={resource.table.page} setPage={resource.table.setPage}
                rowsPerPage={resource.table.rowsPerPage} setRowsPerPage={resource.table.setRowsPerPage}
                search={resource.table.search} setSearch={resource.table.setSearch}
                sortDescriptor={resource.table.sortDescriptor} setSortDescriptor={resource.table.setSortDescriptor}
                statusFilter="" setStatusFilter={() => { }} // No status filter for categories yet
                statusOptions={[]} // No status options
                isServerSide={true}
                sortOptions={sortOptions}
                refresh={resource.table.refresh}
            >
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <div className="flex gap-2">
                        {user?.can?.categories?.includes('create') && (
                            <Button
                                onPress={resource.modal.handleCreate}
                                className="w-fit" size="sm" color="primary"
                                startContent={<Plus size={12}></Plus>}
                            >
                                <span className="hidden md:block">Create Category</span>
                            </Button>
                        )}
                    </div>
                    <Filters />
                </div>

                <CategoryModal
                    isOpen={resource.modal.isOpen}
                    onOpenChange={resource.modal.onOpenChange}
                    onClose={resource.modal.onClose}
                    category={resource.modal.selectedItem}
                    onSave={resource.modal.handleSave}
                />

                <CategoryDetailModal
                    isOpen={resource.view.isOpen}
                    onOpenChange={resource.view.onOpenChange}
                    onClose={resource.view.onClose}
                    category={resource.view.selectedItem}
                />

                <ConfirmationModal
                    isOpen={resource.delete.isOpen}
                    onOpenChange={resource.delete.onOpenChange}
                    onClose={resource.delete.onClose}
                    onConfirm={resource.delete.onConfirmDelete}
                    title="Delete Category"
                    message={`Are you sure you want to delete this category? Products associated with it may lose their categorization.`}
                    confirmText="Delete"
                />

                <Table actions={tableActions} isLoading={resource.table.isLoading} renderCell={renderCell} />
                <TablePagination />
            </TableProvider>
        </div>
    );
}
