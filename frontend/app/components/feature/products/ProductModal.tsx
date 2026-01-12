import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem
} from "@heroui/react";
import { Form } from "react-router";
import type { Product, ProductFormData } from "~/types/product";
import type { Category } from "~/types/category";


interface ProductModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    product?: Product | null;
    onSave: (data: ProductFormData) => Promise<void>;
    categories: Category[];
}

export default function ProductModal({ isOpen, onOpenChange, onClose, product, onSave, categories }: ProductModalProps) {
    const size = "2xl";
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        category_id: undefined,
        low_stock_threshold: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (product) {
                const categoryId = product.category_id;

                setFormData({
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity || 0,
                    description: product.description || '',
                    category_id: categoryId,
                    low_stock_threshold: product.low_stock_threshold || 0,
                });
            } else {
                setFormData({
                    name: '',
                    price: 0,
                    quantity: 0,
                    description: '',
                    category_id: undefined,
                    low_stock_threshold: 0,
                });
            }
            setErrors({});
        }
    }, [isOpen, product]);

    const handleChange = (field: keyof ProductFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (formData.price < 0) newErrors.price = "Price must be positive";
        if (formData.quantity < 0) newErrors.quantity = "Stock must be positive"; // Changed 'stock' to 'quantity' for consistency

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Failed to save product", error);
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
                            {product ? "Edit Product" : "Create New Product"}
                            <span className="text-small text-default-400 font-normal">
                                {product ? "Update product details below." : "Enter the details below to create a new product."}
                            </span>
                        </ModalHeader>

                        <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <Input
                                            autoFocus
                                            label="Product Name"
                                            placeholder="Chicken"
                                            variant="bordered"
                                            className="flex-1"
                                            value={formData.name}
                                            onValueChange={(val) => handleChange('name', val)}
                                            isInvalid={!!errors.name}
                                            errorMessage={errors.name}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <Input
                                            label="Price"
                                            placeholder="0.00"
                                            type="number"
                                            variant="bordered"
                                            className="flex-1"
                                            value={formData.price.toString()}
                                            onValueChange={(val) => handleChange('price', parseFloat(val) || 0)}
                                            isInvalid={!!errors.price}
                                            errorMessage={errors.price}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">$</span>
                                                </div>
                                            }
                                        />
                                        <Input
                                            label="Stock Quantity"
                                            placeholder="0"
                                            type="number"
                                            variant="bordered"
                                            className="flex-1"
                                            value={formData.quantity.toString()}
                                            onValueChange={(val) => handleChange('quantity', parseInt(val) || 0)}
                                            isInvalid={!!errors.quantity}
                                            errorMessage={errors.quantity}
                                        />
                                        <Input
                                            label="Low Stock Threshold"
                                            placeholder="0"
                                            type="number"
                                            variant="bordered"
                                            className="flex-1"
                                            value={(formData.low_stock_threshold || 0).toString()}
                                            onValueChange={(val) => handleChange('low_stock_threshold', parseInt(val) || 0)}
                                            isInvalid={!!errors.low_stock_threshold}
                                            errorMessage={errors.low_stock_threshold}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Select
                                            label="Category"
                                            placeholder="Select a category"
                                            variant="bordered"
                                            className="flex-1"
                                            selectedKeys={formData.category_id ? [String(formData.category_id)] : []}
                                            onChange={(e) => handleChange('category_id', e.target.value)}
                                            isInvalid={!!errors.category_id}
                                            errorMessage={errors.category_id}
                                        >
                                            {categories && categories.map((category) => (
                                                <SelectItem key={category.category_id} textValue={category.name || ''}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <Textarea
                                        label="Description"
                                        placeholder="Enter product description"
                                        variant="bordered"
                                        value={formData.description || ''}
                                        onValueChange={(val) => handleChange('description', val)}
                                    />

                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" isLoading={isLoading}>
                                    {product ? "Update Product" : "Save Product"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
