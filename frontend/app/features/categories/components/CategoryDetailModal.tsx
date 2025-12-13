import React, { useEffect, useState } from "react";
import moment from "moment"
import { getAudit } from "~/api/categoryApi";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Divider,
} from "@heroui/react";
import type { Category } from "~/types/category";

interface CategoryDetailModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    category: Category | null;
}

export default function CategoryDetailModal({ isOpen, onOpenChange, onClose, category }: CategoryDetailModalProps) {
    const size = "2xl";

    if (!category) return null;

    const [audits, setAudits] = useState<any[]>([]);

    useEffect(() => {
        if (category && category.category_id) {
            getAudit(category.category_id).then((response) => {
                setAudits(response || []);
            });
        }
    }, [category]);

    const createDate = moment(category.created_at).format('DD-MM-YYYY HH:mm:ss');
    const updateDate = moment(category.updated_at).format('DD-MM-YYYY HH:mm:ss');

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} backdrop="blur" onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Category Details
                            <span className="text-small text-default-400 font-normal">
                                View category information and history.
                            </span>
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Category Name</span>
                                    <span className="text-small font-medium">{category.name}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Code</span>
                                    <span className="text-small">{category.code}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Created At</span>
                                    <span className="text-small">{createDate}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Last Updated</span>
                                    <span className="text-small">{updateDate}</span>
                                </div>
                            </div>

                            {category.description && (
                                <div className="mt-2 flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Description</span>
                                    <p className="text-small text-default-700">{category.description}</p>
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
                                                            <span className="capitalize font-medium">{audit.event}</span> this category
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
