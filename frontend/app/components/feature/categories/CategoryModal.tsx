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
} from "@heroui/react";
import { Form } from "react-router";
import type { Category, CategoryFormData } from "~/types/category";

interface CategoryModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    category?: Category | null;
    onSave: (data: CategoryFormData) => Promise<void>;
}

export default function CategoryModal({ isOpen, onOpenChange, onClose, category, onSave }: CategoryModalProps) {
    const size = "2xl";
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        code: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData({
                    name: category.name || '',
                    code: category.code || '',
                    description: category.description || '',
                });
            } else {
                setFormData({
                    name: '',
                    code: '',
                    description: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, category]);

    const handleChange = (field: keyof CategoryFormData, value: string) => {
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
        if (!formData.code) newErrors.code = "Code is required";

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
            console.error("Failed to save category", error);
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
                            {category ? "Edit Category" : "Create New Category"}
                            <span className="text-small text-default-400 font-normal">
                                {category ? "Update category details below." : "Enter the details below to create a new category."}
                            </span>
                        </ModalHeader>

                        <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <Input
                                            autoFocus
                                            label="Category Name"
                                            placeholder="Electronics"
                                            variant="bordered"
                                            className="flex-1"
                                            value={formData.name}
                                            onValueChange={(val) => handleChange('name', val)}
                                            isInvalid={!!errors.name}
                                            errorMessage={errors.name}
                                        />
                                        <Input
                                            label="Code"
                                            placeholder="ELEC"
                                            variant="bordered"
                                            className="flex-1"
                                            value={formData.code}
                                            onValueChange={(val) => handleChange('code', val)}
                                            isInvalid={!!errors.code}
                                            errorMessage={errors.code}
                                        />
                                    </div>

                                    <Textarea
                                        label="Description"
                                        placeholder="Enter category description"
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
                                    {category ? "Update Category" : "Save Category"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
