"use client";

import { useResource } from "~/hooks/useResource";
import * as usersApi from "~/api/usersApi";
import Filters from "~/components/common/table/Filters";
import Table from "~/components/common/table/Table";
import TablePagination from "~/components/common/table/TablePagination";
import { TableProvider } from "~/context/tableContext";
import type { User, UserFormData } from "~/types/user";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@heroui/react";
import UserModal from "~/features/users/components/UserModal";
import UserDetailModal from "~/features/users/components/UserDetailModal";
import ConfirmationModal from "~/components/common/feedback/ConfirmationModal";
import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useAuth } from "~/context/authContext";

const columns = [
    { key: "name", label: "USER" },
    { key: "email", label: "EMAIL" },
    { key: "roles", label: "ROLES" },
    { key: "actions", label: "ACTIONS" }
];

const sortOptions = [
    { label: 'Name A-Z', key: 'name', direction: 'ascending' },
    { label: 'Name Z-A', key: 'name', direction: 'descending' },
];

export default function Users() {
    const { user: currentUser } = useAuth();
    const {
        isOpen: isDetailOpen,
        onOpen: onDetailOpen,
        onOpenChange: onDetailOpenChange,
        onClose: onDetailClose
    } = useDisclosure();

    const [detailUser, setDetailUser] = useState<User | null>(null);

    // Use Resource Hook
    const resource = useResource<User>({
        api: {
            getAll: usersApi.getUsers,
            create: usersApi.createUser,
            update: usersApi.updateUser,
            delete: usersApi.deleteUser,
            get: usersApi.getUser,
            audits: usersApi.getAudit
        },
        normalizeData: (response: any) => ({
            data: response.users,
            total: response.total
        }),
        defaultSort: {
            column: sortOptions[0].key,
            direction: sortOptions[0].direction as "ascending" | "descending"
        }
    });

    const handleView = async (user: User) => {
        try {
            const freshData = await usersApi.getUser(user.user_id);
            const userData = Array.isArray(freshData) ? freshData[0] : freshData;

            if (user.user_id) {
                userData.audit = await usersApi.getAudit(user.user_id);
            }

            setDetailUser(userData);
            onDetailOpen();
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };

    const tableActions = [
        {
            key: "view",
            label: "View Details",
            icon: <Eye size={18} />,
            onClick: (item: User) => handleView(item),
            isVisible: true
        },
        {
            key: "edit",
            label: "Edit User",
            icon: <Edit size={18} />,
            onClick: (item: User) => resource.modal.handleEdit(item),
            isVisible: currentUser?.roles?.includes('admin')
        },
        {
            key: "delete",
            label: "Delete User",
            icon: <Trash2 size={18} className="text-danger" />,
            isHidden: (item: User) => !!(currentUser && String(item.user_id) === String(currentUser.user_id)),
            onClick: (item: User) => {
                if (currentUser && String(item.user_id) === String(currentUser.user_id)) {
                    return;
                }
                resource.delete.handleDelete(item.user_id);
            },
            isVisible: currentUser?.roles?.includes('admin')
        }
    ].filter(action => action.isVisible !== false);


    return (
        <div className="p-4 flex flex-1 flex-col h-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Management</h1>
            <TableProvider
                data={resource.table.items}
                totalItems={resource.table.totalItems}
                columns={columns}
                page={resource.table.page} setPage={resource.table.setPage}
                rowsPerPage={resource.table.rowsPerPage} setRowsPerPage={resource.table.setRowsPerPage}
                search={resource.table.search} setSearch={resource.table.setSearch}
                sortDescriptor={resource.table.sortDescriptor} setSortDescriptor={resource.table.setSortDescriptor}
                isServerSide={true}
                sortOptions={sortOptions}
                refresh={resource.table.refresh}
            >
                <div className="flex flex-row w-full justify-between items-center gap-2">
                    <div className="flex gap-2">
                        {currentUser?.roles?.includes('admin') && (
                            <Button
                                onPress={resource.modal.handleCreate}
                                className="w-fit" size="sm" color="primary"
                                startContent={<Plus size={12}></Plus>}
                            >
                                <span className="hidden md:block">Create User</span>
                            </Button>
                        )}
                    </div>
                    <Filters />
                </div>

                <UserModal
                    isOpen={resource.modal.isOpen}
                    onOpenChange={resource.modal.onOpenChange}
                    onClose={resource.modal.onClose}
                    user={resource.modal.selectedItem}
                    onSave={resource.modal.handleSave}
                />

                <UserDetailModal
                    isOpen={isDetailOpen}
                    onOpenChange={onDetailOpenChange}
                    onClose={onDetailClose}
                    user={detailUser}
                />

                <ConfirmationModal
                    isOpen={resource.delete.isOpen}
                    onOpenChange={resource.delete.onOpenChange}
                    onClose={resource.delete.onClose}
                    onConfirm={resource.delete.onConfirmDelete}
                    title="Delete User"
                    message={`Are you sure you want to delete this user? This action cannot be undone.`}
                    confirmText="Delete"
                />

                <Table actions={tableActions} isLoading={resource.table.isLoading} />
                <TablePagination />
            </TableProvider>
        </div>
    );
}