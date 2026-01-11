"use client";

import FilterContainer from "~/components/common/table/filters/FilterContainer";
import FilterSearch from "~/components/common/table/filters/FilterSearch";
import FilterSort from "~/components/common/table/filters/FilterSort";
import Table from "~/components/common/table/Table";
import { createUser, deleteUser, getUsers, updateUser, getAudit } from "~/apis/usersApi";
import TablePagination from "~/components/common/table/TablePagination";
import FilterDropdown from "~/components/common/table/filters/FilterDropdown";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import UserDetailModal from "~/components/feature/users/UserDetailModalv2";
import { Button, Spinner, useDisclosure, user } from "@heroui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User, UserFormData } from "~/types/user";
import { useTableStore } from "~/contexts/useTableStore";
import UserModal from "~/components/feature/users/UserModal";
import { useAuth } from "~/contexts/authContext";
import ConfirmationModal from "~/components/common/feedback/ConfirmationModal";
import { useNavigate } from "react-router";


const sortOptions = [
    { label: 'Name A-Z', key: 'name', direction: 'ascending' },
    { label: 'Name Z-A', key: 'name', direction: 'descending' },
];

const statusFilter = [
    { key: "active", label: "Active", value: "active" },
    { key: "all", label: "All", value: "all" },
    { key: "inactive", label: "Inactive", value: "deactivated" },
];

const columns = [
    { key: "name", label: "USER" },
    { key: "email", label: "EMAIL" },
    { key: "roles", label: "ROLES" },
    { key: "actions", label: "ACTIONS" }
];

const api = {
    get: getUsers,
    create: createUser,
    update: updateUser,
    delete: deleteUser,
    key: "users"
};

export default function Users() {
    const { page, limit, filters, sort, fetchData, setSort, setFilter, reset } = useTableStore(state => state);
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { user: currentUser } = useAuth();
    const permissions = currentUser?.can?.users;
    const navigate = useNavigate();

    const isFirstRender = useRef(true);

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

    const openModalDetail = useCallback(async (user: User) => {
        const audit = await getAudit(user.user_id);
        user.audit = audit;
        setSelectedUser(user);
        onOpenDetail();
    }, [isOpenDetail]);

    const openModalEdit = useCallback(async (user?: User) => {
        console.log(user)
        if (user) {
            const audit = await getAudit(user.user_id);
            user.audit = audit;
        }
        setSelectedUser(user || null);
        onOpenEdit();
    }, [isOpenDetail]);

    const closeModalDetail = useCallback(() => {
        setSelectedUser(null);
        onCloseDetail();
    }, [onCloseDetail]);

    const closeModalEdit = useCallback(() => {
        setSelectedUser(null);
        onCloseEdit();
    }, [onCloseEdit]);

    const handleSave = useCallback(async (data: UserFormData, userId?: string | number) => {
        if (userId) {
            await updateUser(userId, data);
        } else {
            await createUser(data);
        }

        await fetchData(api);
        onCloseEdit();
    }, [onCloseEdit]);

    const handleDelete = useCallback(async (userId: string | number) => {
        await deleteUser(userId);
        await fetchData(api);
        onCloseDelete();
    }, [onCloseDelete]);

    const isDeleteHidden = (user: User) => user.user_id === currentUser?.user_id || !permissions?.includes('delete')

    const actions = useMemo(() => [
        { key: "view", label: "View", icon: <Eye size={15} />, onClick: openModalDetail, isVisible: permissions?.includes('view') },
        { key: "edit", label: "Edit", icon: <Edit size={15} />, onClick: openModalEdit, isVisible: permissions?.includes('update') },
        { key: "delete", label: "Delete", icon: <Trash2 size={15} className="text-danger-300" />, onClick: onOpenDelete, isHidden: isDeleteHidden, isVisible: permissions?.includes('delete') },
    ], [openModalDetail, openModalEdit]);

    const defaultSort = sortOptions[0];

    //this will run on first render
    useEffect(() => {
        reset();
        setSort(defaultSort);
        setFilter('status', 'active');
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Management</h1>
            <UserDetailModal isOpen={isOpenDetail} user={selectedUser} onClose={closeModalDetail} />
            <UserModal isOpen={isOpenEdit} onClose={closeModalEdit} onSave={handleSave} user={selectedUser} onOpenChange={onOpenChangeEdit} />
            <ConfirmationModal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} onClose={onCloseDelete} onConfirm={() => handleDelete(selectedUser?.user_id || '')} />
            <div className="flex items-center justify-between">
                {permissions?.includes('create') &&
                    <Button color="primary" className="w-fit" size="sm" endContent={<Plus size={15} />} onPress={() => openModalEdit()}>
                        Create User
                    </Button>
                }
                <FilterContainer>
                    <FilterSearch />
                    <FilterSort items={sortOptions} />
                    <FilterDropdown filterKey="status" items={statusFilter} />
                </FilterContainer>
            </div>
            <Table
                columns={columns}
                actions={actions}>
            </Table>
            <TablePagination />
        </div>
    );
}