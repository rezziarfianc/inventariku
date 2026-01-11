"use client";

import FilterContainer from "~/components/common/table/filters/FilterContainer";
import FilterSearch from "~/components/common/table/filters/FilterSearch";
import FilterSort from "~/components/common/table/filters/FilterSort";
import Table from "~/components/common/table/Table";
import TablePagination from "~/components/common/table/TablePagination";
import FilterDropdown from "~/components/common/table/filters/FilterDropdown";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Button, Chip, Spinner, useDisclosure, user } from "@heroui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTableStore } from "~/contexts/useTableStore";
import { useAuth } from "~/contexts/authContext";
import ConfirmationModal from "~/components/common/feedback/ConfirmationModal";
import { useNavigate } from "react-router";
import { createProduct, deleteProduct, getProducts, updateProduct, manageStock } from "~/apis/productsApi";
import type { Product, ProductFormData } from "~/types/product";
import type { Category } from "~/types/category";
import { getCategories } from "~/apis/categoryApi";
import ProductDetailModal from "~/components/feature/products/ProductDetailModal";
import ProductModal from "~/components/feature/products/ProductModal";
import StockManagementModal from "~/components/feature/products/StockManagementModal";

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
    { label: 'Most Quantity', key: 'stock', direction: 'descending' },
    { label: 'Least Quantity', key: 'stock', direction: 'ascending' },
];

const stockOptions = [
    { label: 'All', key: 'all', value: null },
    { label: 'In Stock', key: 'in_stock', value: "in_stock" },
    { label: 'Low Stock', key: 'low_stock', value: "low_stock" },
    { label: 'Out of Stock', key: 'out_of_stock', value: "out_of_stock" },
];

const api = {
    get: getProducts,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    key: "products"
};

const renderCell = (item: Product, columnKey: any): React.ReactNode => {
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
    if (columnKey === "price") {
        return `Rp. ` + item?.price?.toLocaleString();
    }
    if (columnKey === "category") {
        return item.category?.name || "-";
    }
    if (columnKey === "brand") {
        return item.brand?.name || "-";
    }
    const value = item[columnKey as keyof Product];

    if (typeof value === "object") {
        return "[Object object]";
    }

    return value ?? "-";
};

const defaultCategories: any[] = [
    { label: 'All', key: 'all', value: null },
];

export default function Products() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const { page, limit, filters, sort, fetchData, setSort, setPage, reset } = useTableStore(state => state);
    const navigate = useNavigate();
    const permissions = currentUser?.can?.products;
    const stockPermissions = currentUser?.can?.supplies;
    const [categories, setCategories] = useState<any[]>(defaultCategories);
    const [rawCategories, setRawCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { isOpen: isOpenDetail, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const isFirstRender = useRef(true);

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

    const onOpenDetailModal = useCallback((product: Product) => {
        setSelectedProduct(product);
        onOpen();
    }, [onOpen]);

    const onOpenEditModal = useCallback((product?: Product) => {
        if (product) {
            setSelectedProduct(product);
        }
        onOpenEdit();
    }, [onOpenEdit]);

    const onCloseEditModal = useCallback(() => {
        setSelectedProduct(null);
        onCloseEdit();
    }, [selectedProduct, onCloseEdit]);

    const onEditSave = useCallback(async (data: ProductFormData): Promise<void> => {
        const selectedId = selectedProduct?.product_id;
        if (selectedId) {
            await updateProduct(selectedId, data);
        } else {
            await createProduct(data);
        }

        setSelectedProduct(null);
        await fetchData(api);
        onCloseEdit();
    }, [selectedProduct, onCloseEdit]);

    const onOpenDeleteModal = useCallback((product: Product) => {
        setSelectedProduct(product);
        onOpenDelete();
    }, [onOpenDelete]);

    const onConfirmDelete = useCallback(() => {
        const selectedId = selectedProduct?.product_id;
        if (selectedId) {
            deleteProduct(selectedId).then(res => {
                fetchData(api);
            });
        }
        setSelectedProduct(null);
        onCloseDelete();
    }, [selectedProduct, onCloseDelete]);

    const defaultSort = sortOptions[0];

    // set default sort
    useEffect(() => {

        reset();
        // fetch categories
        // todo : implements search at categories
        const params = {
            page: 1,
            per_page: 100
        }

        getCategories(params).then(res => {
            const categories = res.categories.map((category) => ({
                label: category.name,
                key: category.name, value: category.category_id
            }))
            setRawCategories(res.categories);
            setCategories(defaultCategories.concat(categories));
        });

        setSort(defaultSort);
        setPage(1);
    }, []);

    // if theres any changes to filters, sort, or page, fetch new data
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchData(api);
    }, [page, limit, filters, sort, api]);

    const actions = [
        { key: "view", label: "View", icon: <Eye size={15} />, onClick: onOpenDetailModal, isVisible: permissions?.includes('view') },
        { key: "manage_stock", label: "Manage Stock", icon: <Plus size={15} />, onClick: (product: Product) => setAddStockState({ isOpen: true, product }), isVisible: stockPermissions?.includes('create') },
        { key: "edit", label: "Edit", icon: <Edit size={15} />, onClick: onOpenEditModal, isVisible: permissions?.includes('update') },
        { key: "delete", label: "Delete", icon: <Trash2 size={15} className="text-danger-300" />, onClick: onOpenDeleteModal, isVisible: permissions?.includes('delete') },
    ]
    const [addStockState, setAddStockState] = useState<{ isOpen: boolean; product: Product | null }>({
        isOpen: false,
        product: null
    });

    const handleManageStockSave = async (productId: number | string, quantity: number, flowType: 'inbound' | 'outbound') => {
        await manageStock(productId, quantity, flowType);
        fetchData(api);
        setAddStockState({ isOpen: false, product: null });
    };

    return (
        <div className="p-4 flex flex-1 flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Products Management</h1>
            <ProductDetailModal isOpen={isOpenDetail} onOpenChange={onOpenChange} onClose={onClose} product={selectedProduct} />
            <ProductModal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} onClose={onCloseEditModal} product={selectedProduct} onSave={onEditSave} categories={rawCategories} />
            <StockManagementModal
                isOpen={addStockState.isOpen}
                onOpenChange={(isOpen) => setAddStockState(prev => ({ ...prev, isOpen }))}
                onClose={() => setAddStockState({ isOpen: false, product: null })}
                product={addStockState.product}
                onSave={handleManageStockSave}
            />
            <ConfirmationModal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} onClose={onCloseDelete} onConfirm={onConfirmDelete} />
            <div className="flex items-center justify-between">
                {permissions?.includes('create') && <Button onPress={() => onOpenEditModal()} size="sm" color="primary" endContent={<Plus size={15} />}>New Product</Button>}
                <FilterContainer>
                    <FilterSearch />
                    <FilterSort items={sortOptions} />
                    <FilterDropdown filterKey="stock" items={stockOptions} />
                    <FilterDropdown filterKey="category" items={categories} />
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