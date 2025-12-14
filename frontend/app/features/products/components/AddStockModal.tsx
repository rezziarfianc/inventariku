import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input
} from "@heroui/react";
import { Form } from "react-router";
import type { Product } from "~/types/product";

interface AddStockModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    product: Product | null;
    onSave: (productId: number | string, quantity: number) => Promise<void>;
}

export default function AddStockModal({ isOpen, onOpenChange, onClose, product, onSave }: AddStockModalProps) {
    const size = "md";
    const [quantity, setQuantity] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setQuantity(0);
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
            await onSave(product.product_id, quantity);
            onClose();
        } catch (error) {
            console.error("Failed to add stock", error);
            setError("Failed to add stock. Please try again.");
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
                            Add Stock
                            {product && <span className="text-small text-default-400 font-normal">
                                Adding stock for: <b>{product.name}</b>
                            </span>}
                        </ModalHeader>

                        <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        autoFocus
                                        label="Quantity to Add"
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
                                    />
                                    {product && (
                                        <div className="text-small text-default-500">
                                            Current Quantity: {product.quantity}
                                        </div>
                                    )}
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" isLoading={isLoading}>
                                    Add Stock
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
