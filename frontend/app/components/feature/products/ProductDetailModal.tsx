import React, { useEffect, useState } from "react";
import moment from "moment"
import { getAudit, getSupplyFlows } from "~/apis/productsApi";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Divider,
} from "@heroui/react";
import type { Product } from "~/types/product";

interface ProductDetailModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    product: Product | null;
}

export default function ProductDetailModal({ isOpen, onOpenChange, onClose, product }: ProductDetailModalProps) {
    const size = "2xl";

    if (!product) return null;

    const [audits, setAudits] = useState<any[]>([]);
    const [supplyFlows, setSupplyFlows] = useState<any[]>([]);

    useEffect(() => {
        if (product && product.product_id) {
            getAudit(product.product_id).then((response) => {
                setAudits(response || []);
            });
            getSupplyFlows({ product_id: product.product_id, per_page: 5 }).then((response) => {
                setSupplyFlows(response || []);
            });
        }
    }, [product]);

    // const audits = product.audit || []; // Using fetched audits instead
    const createDate = moment(product.created_at).format('DD-MM-YYYY HH:mm:ss');
    const updateDate = moment(product.updated_at).format('DD-MM-YYYY HH:mm:ss');

    const stockStatusColor = product.status === "in_stock" ? "success" : product.status === "low_stock" ? "warning" : "danger";

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} backdrop="blur" onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Product Details
                            <span className="text-small text-default-400 font-normal">
                                View product information and history.
                            </span>
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Product Name</span>
                                    <span className="text-small font-medium">{product.name}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Category</span>
                                    <span className="text-small">{typeof product.category === 'object' ? product.category?.name : product.category}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Price</span>
                                    <span className="text-small">Rp. {parseInt(product.price as any).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Stock</span>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-small">{product.quantity ?? 0} units</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Status</span>
                                    <Chip
                                        color={stockStatusColor}
                                        variant="flat"
                                        size="sm"
                                        className="capitalize"
                                    >
                                        {product.status?.replaceAll("_", " ")}
                                    </Chip>
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

                            {product.description && (
                                <div className="mt-2 flex flex-col gap-1.5">
                                    <span className="text-small text-default-500">Description</span>
                                    <p className="text-small text-default-700">{product.description}</p>
                                </div>
                            )}

                            {supplyFlows.length > 0 && (
                                <>
                                    <Divider className="my-2" />
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-small text-default-500 mb-2">Recent Stock Flow</span>
                                            <div className="flex flex-col gap-2">
                                                {supplyFlows.map((flow: any, index: any) => (
                                                    <div key={index} className="flex justify-between items-center text-xs bg-default-50 p-2 rounded-md">
                                                        <div className="flex flex-col">
                                                            <div className="flex gap-2 items-center">
                                                                <Chip size="sm" variant="flat" color={flow.flow_type === 'inbound' ? 'success' : 'warning'} className="h-5 text-[10px]">
                                                                    {flow.flow_type === 'inbound' ? 'Inbound' : 'Outbound'}
                                                                </Chip>
                                                                <span className="font-semibold">{flow.quantity} units</span>
                                                            </div>
                                                            <span className="text-default-400 mt-1">{moment(flow.created_at).format('DD MMM YYYY HH:mm')}</span>
                                                        </div>
                                                        <span className="text-default-500">{flow.audits && flow.audits[0] && flow.audits[0].user && flow.audits[0].user.name ? `by ${flow.audits[0].user.name}` : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
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
                                                            <span className="capitalize font-medium">{audit.event}</span> this product
                                                        </div>
                                                        {/* Optional: Show what changed if audit details exist */}
                                                        {/* {audit.old_values && audit.new_values && ( ... )} */}
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
