import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Tabs,
    Tab
} from "@heroui/react";
import { Form } from "react-router";
import type { Product } from "~/types/product";
import { MoveDown, MoveUp } from "lucide-react";

interface StockManagementModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    product: Product | null;
    onSave: (productId: number | string, quantity: number, flowType: 'inbound' | 'outbound') => Promise<void>;
}

export default function StockManagementModal({ isOpen, onOpenChange, onClose, product, onSave }: StockManagementModalProps) {
    const size = "md";
    const [quantity, setQuantity] = useState<number>(0);
    const [flowType, setFlowType] = useState<'inbound' | 'outbound'>('inbound');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setQuantity(0);
            setFlowType('inbound');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (quantity <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        if (!product?.product_id) {
            setError("Invalid product");
            return;
        }

        setIsLoading(true);
        try {
            await onSave(product.product_id, quantity, flowType);
            onClose();
        } catch (error: any) {
            console.error("Failed to update stock", error);
            setError(error?.response?.data?.message || "Failed to update stock. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} backdrop="blur" onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Manage Stock
                            {product && <span className="text-small text-default-400 font-normal">
                                Managing stock for: <b>{product.name}</b>
                            </span>}
                        </ModalHeader>

                        <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                            <ModalBody>
                                <Tabs
                                    fullWidth
                                    size="md"
                                    aria-label="Stock Flow Type"
                                    selectedKey={flowType}
                                    onSelectionChange={(key) => setFlowType(key as 'inbound' | 'outbound')}
                                >
                                    <Tab key="inbound" title={
                                        <div className="flex items-center space-x-2">
                                            <MoveDown size={16} />
                                            <span>Add Stock</span>
                                        </div>
                                    } />
                                    <Tab key="outbound" title={
                                        <div className="flex items-center space-x-2">
                                            <MoveUp size={16} />
                                            <span>Take Stock</span>
                                        </div>
                                    } />
                                </Tabs>

                                <div className="flex flex-col gap-4 mt-2">
                                    <Input
                                        autoFocus
                                        label={flowType === 'inbound' ? "Quantity to Add" : "Quantity to Remove"}
                                        placeholder="0"
                                        type="number"
                                        variant="bordered"
                                        value={quantity.toString()}
                                        onValueChange={(val) => {
                                            const num = parseInt(val);
                                            setQuantity(isNaN(num) ? 0 : num);
                                            if (error) setError('');
                                        }}
                                        isInvalid={!!error}
                                        errorMessage={error}
                                        min={1}
                                        description={product && `Current Quantity: ${product.quantity}`}
                                    />
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color={flowType === 'inbound' ? "primary" : "warning"}
                                    type="submit"
                                    isLoading={isLoading}
                                >
                                    {flowType === 'inbound' ? "Add Stock" : "Remove Stock"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
