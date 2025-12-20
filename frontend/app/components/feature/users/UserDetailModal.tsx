import React from "react";
import moment from "moment"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Chip,
    Divider,
} from "@heroui/react";
import type { User } from "~/types/user";

interface UserDetailModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    user: User | null;
}

export default function UserDetailModal({ isOpen, onOpenChange, onClose, user }: UserDetailModalProps) {
    const size = "2xl";

    if (!user) return null;
    const permissions = Object.entries(user.can || {}).map(([key, value]) => ({
        feature: key,
        actions: value
    }));

    const audits = user.audit || [];
    const createDate = moment(user.created_at).format('DD-MM-YYYY HH:mm:ss');

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} backdrop="blur" onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            User Details
                            <span className="text-small text-default-400 font-normal">
                                View user information.
                            </span>
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">User Name</span>
                                    <span className="text-small font-medium">{user.name}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Email</span>
                                    <span className="text-small">{user.email}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Roles</span>
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role, index) => (
                                                <Chip key={index} color="primary" variant="flat" size="sm" className="capitalize">
                                                    {role.replaceAll("_", " ").charAt(0).toUpperCase() + role.replaceAll("_", " ").slice(1)}
                                                </Chip>
                                            ))
                                        ) : (
                                            <span className="text-small text-default-400">No roles assigned</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Created At</span>
                                    <span className="text-small">{createDate}</span>
                                </div>
                            </div>

                            {permissions.length > 0 && (
                                <div className="mt-2 flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Permissions</span>
                                    <div className="flex flex-wrap gap-1">
                                        {permissions.map((permission, index) => (
                                            <React.Fragment key={index}>
                                                <div className="flex flex-col gap-1 w-full">
                                                    <span className="text-small text-default-500">&nbsp;{permission.feature} :</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {permission.actions && permission.actions.map((action: any, actionIndex: any) => (
                                                            <Chip key={`${index}-${actionIndex}`} color="success" variant="flat" size="sm" className="capitalize">
                                                                {action}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                </div>

                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {audits.length > 0 && (
                                <>
                                    <Divider className="my-2" />
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-small text-default-500 mb-2">Audit Log</span>
                                            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                                                {audits.map((audit: any, index: any) => (
                                                    <div key={index} className="flex flex-col text-xs bg-default-50 p-2 rounded-md">
                                                        <div className="flex justify-between">
                                                            <span className="font-semibold text-primary">{audit?.user?.name || 'System'}</span>
                                                            <span className="text-default-400">{moment(audit.created_at).format('DD-MM-YYYY HH:mm')}</span>
                                                        </div>
                                                        <div className="mt-1">
                                                            <span className="capitalize font-medium">{audit.event}</span> this user
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
