import { useState } from "react";
import { useDisclosure, type SortDescriptor } from "@heroui/react";
import { useTableData } from "./useTableData";
import type { UseResourceProps } from "~/types/api";

export function useResource<T extends { id?: string | number; user_id?: string | number; name?: string }>(
    { api, normalizeData, defaultSort }: UseResourceProps<T>
) {
    // 1. Table Data Management
    const table = useTableData<T>({
        initialSort: defaultSort,
        fetchData: async (params) => {
            const response = await api.getAll(params);
            if (normalizeData) {
                return normalizeData(response);
            }
            return response;
        },
    });

    const formModal = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const handleCreate = () => {
        setSelectedItem(null);
        formModal.onOpen();
    };

    const handleEdit = (item: T) => {
        setSelectedItem(item);
        formModal.onOpen();
    };

    const handleSave = async (formData: any) => {
        try {
            const id = selectedItem?.id || selectedItem?.user_id; // Handle both id conventions
            if (selectedItem && id) {
                await api.update(id, formData);
            } else {
                await api.create(formData);
            }
            formModal.onClose();
            table.refresh();
        } catch (error) {
            console.error("Failed to save item:", error);
            throw error; // Let component handle specific UI feedback if needed
        }
    };

    // 3. Delete Confirmation
    const deleteModal = useDisclosure();
    const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);

    const handleDelete = (itemId: string | number) => {
        setItemToDelete(itemId);
        console.log("Item to delete:", itemId);
        deleteModal.onOpen();
    };

    const onConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const id = itemToDelete;
            if (id) {
                await api.delete(id);
                table.refresh();
                deleteModal.onClose();
                setItemToDelete(null);
            }
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    // 4. View Details
    const viewModal = useDisclosure();
    const [viewSelectedItem, setViewSelectedItem] = useState<T | null>(null);

    const handleView = (item: T) => {
        setViewSelectedItem(item);
        viewModal.onOpen();
    };

    return {
        table,
        modal: {
            isOpen: formModal.isOpen,
            onOpenChange: formModal.onOpenChange,
            onClose: formModal.onClose,
            selectedItem,
            handleCreate,
            handleEdit,
            handleSave,
        },
        delete: {
            isOpen: deleteModal.isOpen,
            onOpenChange: deleteModal.onOpenChange,
            onClose: deleteModal.onClose,
            itemToDelete,
            handleDelete,
            onConfirmDelete,
        },
        view: {
            isOpen: viewModal.isOpen,
            onOpenChange: viewModal.onOpenChange,
            onClose: viewModal.onClose,
            selectedItem: viewSelectedItem,
            handleView,
        },
    };
}
