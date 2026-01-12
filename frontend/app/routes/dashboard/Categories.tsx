"use client";
import { Button, Spinner, useDisclosure } from "@heroui/react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createCategory, deleteCategory, getAudit, getCategories, updateCategory } from "~/apis/categoryApi";
import ConfirmationModal from "~/components/common/feedback/ConfirmationModal";
import FilterContainer from "~/components/common/table/filters/FilterContainer";
import FilterSearch from "~/components/common/table/filters/FilterSearch";
import FilterSort from "~/components/common/table/filters/FilterSort";
import Table from "~/components/common/table/Table";
import TablePagination from "~/components/common/table/TablePagination";
import CategoryDetailModal from "~/components/feature/categories/CategoryDetailModal";
import CategoryModal from "~/components/feature/categories/CategoryModal";
import { useAuth } from "~/contexts/authContext";
import { useTableStore } from "~/contexts/useTableStore";
import type { Category, CategoryFormData } from "~/types/category";
import { formatDateTime } from "~/libs/utils";

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

const api = {
    get: getCategories,
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
    key: "categories"
};


export default function Categories() {
    const { page, limit, filters, sort, fetchData, setSort, reset } = useTableStore(state => state);
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail, onOpenChange: onOpenChangeDetail } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { user: currentUser } = useAuth();
    const isFirstRender = useRef(true);

    const permissions = currentUser?.can?.categories;
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && !permissions?.includes('view')) {
            navigate("/");
        }

    }, [currentUser, navigate]);

    if (currentUser && !permissions?.includes('view')) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    const openModalEdit = useCallback(async (category?: Category | null) => {
        setSelectedCategory(category || null);
        onOpenEdit();
    }, [isOpenDetail]);

    const openModalDetail = useCallback(async (category: Category) => {
        const audit = await getAudit(category.category_id);
        category.audit = audit;
        setSelectedCategory(category);
        onOpenDetail();
    }, [isOpenDetail]);

    const openModalDelete = useCallback(async (category: Category) => {
        console.log(category);
        setSelectedCategory(category);
        onOpenDelete();
    }, [isOpenDelete]);

    const onCloseModal = useCallback(() => {
        setSelectedCategory(null);
        onCloseDetail();
        onCloseEdit();
        onCloseDelete();
        fetchData(api);
    }, [isOpenDetail, isOpenEdit, isOpenDelete]);

    const handleSave = useCallback(async (data: CategoryFormData, categoryId?: string | number) => {
        if (categoryId) {
            await updateCategory(categoryId, data);
        } else {
            await createCategory(data);
        }
        setSelectedCategory(null);
        fetchData(api);
        onCloseModal();
    }, [isOpenDetail, isOpenEdit, isOpenDelete]);

    const handleDelete = useCallback(async (categoryId: string | number) => {
        await deleteCategory(categoryId);
        setSelectedCategory(null);
        fetchData(api);
        onCloseModal();
    }, [isOpenDetail, isOpenEdit, isOpenDelete]);

    const actions = useMemo(() => [
        { key: "view", label: "View", icon: <Eye size={15} />, onClick: openModalDetail, isVisible: permissions?.includes('view') },
        { key: "edit", label: "Edit", icon: <Edit size={15} />, onClick: openModalEdit, isVisible: permissions?.includes('update') },
        { key: "delete", label: "Delete", icon: <Trash2 size={15} className="text-danger-300" />, onClick: openModalDelete, isVisible: permissions?.includes('delete') },
    ], [openModalDetail, openModalEdit]);

    const renderCell = useCallback((item: Category, columnKey: string): React.ReactNode => {
        if (columnKey === "created_at") {
            return item.created_at ? formatDateTime(item.created_at) : "-";
        }
        const value = item[columnKey as keyof Category];
        if (typeof value === 'string' || typeof value === 'number' || value === null || value === undefined) {
            return value;
        }
        return null;
    }, []);

    const defaultSort = sortOptions[0];

    useEffect(() => {
        reset();
        setSort(defaultSort)
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchData(api);
    }, [page, limit, filters, sort, api]);

    return (
        <div className="p-4 flex flex-1 flex-col h-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Management</h1>
            <div className="flex items-center justify-between">
                {permissions?.includes('create') &&
                    <Button color="primary" className="w-fit" size="sm" endContent={<Plus size={15} />} onPress={() => openModalEdit()}>
                        Create Category
                    </Button>
                }
                <CategoryDetailModal
                    isOpen={isOpenDetail}
                    onOpenChange={onOpenChangeDetail}
                    onClose={onCloseModal}
                    category={selectedCategory}
                />
                <ConfirmationModal
                    isOpen={isOpenDelete}
                    onOpenChange={onOpenChangeDelete}
                    title="Delete Category"
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={() => handleDelete(selectedCategory?.category_id ?? "")}
                    onClose={onCloseModal}
                />
                <CategoryModal
                    isOpen={isOpenEdit}
                    onOpenChange={onOpenChangeEdit}
                    onClose={onCloseModal}
                    category={selectedCategory}
                    onSave={handleSave}
                />
                <FilterContainer>
                    <FilterSearch />
                    <FilterSort items={sortOptions} />
                </FilterContainer>
            </div>
            <Table
                columns={columns}
                actions={actions}
                renderCell={renderCell}>
            </Table>
            <TablePagination />
        </div>
    );
}