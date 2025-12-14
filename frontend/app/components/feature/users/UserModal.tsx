import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Alert,
} from "@heroui/react";
import { Form } from "react-router";
import type { User, UserFormData } from "~/types/user";
import { useAuth } from "~/context/authContext";

const availableRoles = [
    'admin',
    'staff',
    'manager'
];

interface UserModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    user?: User | null;
    onSave: (data: UserFormData) => Promise<void>;
}

export default function UserModal({ isOpen, onOpenChange, onClose, user, onSave }: UserModalProps) {
    const { user: currentUser } = useAuth();
    const size = "2xl";

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        role: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [initialEmail, setInitialEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setFormData({
                    name: user.name,
                    role: user.roles && user.roles.length > 0 ? user.roles[0] : '',
                    email: user.email,
                    password: '',
                    password_confirmation: ''
                });
                setInitialEmail(user.email);
            } else {
                setFormData({
                    name: '',
                    role: '',
                    email: '',
                    password: '',
                    password_confirmation: ''
                });
                setInitialEmail('');
            }
            setErrors({});
            setApiError(null);
        }
    }, [isOpen, user]);

    const handleChange = (field: keyof UserFormData, value: string) => {
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
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.role) newErrors.role = "Role is required";

        if (!user) {
            if (!formData.password) newErrors.password = "Password is required";
            if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = "Passwords do not match";
            }
        } else {
            if (formData.password && formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setApiError(null);
        try {
            const payload = { ...formData };
            if (user && payload.email === initialEmail) {
                delete (payload as any).email;
            }
            await onSave(payload);
            onClose();
        } catch (error: any) {
            console.error("Failed to save user", error);

            // Robust error checking for various formats
            const status = error.status || error.statusCode || error.response?.status;
            const data = error.data || error.response?.data;

            if ((status === 422 || status === 400) && data) {
                setApiError(data.message || "Validation Error");
                if (data.errors) {
                    const apiErrors: Record<string, string> = {};
                    Object.keys(data.errors).forEach(key => {
                        // Handle both array of strings and single string formats
                        const errorMsg = data.errors[key];
                        apiErrors[key] = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
                    });
                    setErrors(apiErrors);
                }
            } else {
                setApiError(error.message || "An unexpected error occurred.");
            }
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
                            {user ? "Edit User" : "Create New User"}
                            <span className="text-small text-default-400 font-normal">
                                {user ? "Update user details below." : "Enter the details below to create a new account."}
                            </span>
                        </ModalHeader>

                        <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                            <ModalBody>
                                {apiError && (
                                    <Alert color="danger" title={apiError} />
                                )}
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <Input
                                            autoFocus
                                            label="Full Name"
                                            placeholder="John Doe"
                                            variant="bordered"
                                            className="flex-1"
                                            value={formData.name}
                                            onValueChange={(val) => handleChange('name', val)}
                                            isInvalid={!!errors.name}
                                            errorMessage={errors.name}
                                        />
                                        <Select
                                            label="Role"
                                            placeholder="Select a role"
                                            variant="bordered"
                                            className="flex-1"
                                            selectedKeys={formData.role ? [formData.role] : []}
                                            onChange={(e) => handleChange('role', e.target.value)}
                                            isInvalid={!!errors.role}
                                            errorMessage={errors.role}
                                            isDisabled={!!(user && currentUser && user.user_id === currentUser.user_id)}
                                        >
                                            {availableRoles.map((role) => (
                                                <SelectItem key={role} textValue={role} className="capitalize">
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    <Input
                                        label="Email Address"
                                        placeholder="john@example.com"
                                        type="email"
                                        variant="bordered"
                                        value={formData.email}
                                        onValueChange={(val) => handleChange('email', val)}
                                        isInvalid={!!errors.email}
                                        errorMessage={errors.email}
                                    />

                                    <div className="flex gap-4">
                                        <Input
                                            label="Password"
                                            placeholder={user ? "Leave blank to keep current" : "Enter password"}
                                            type="password"
                                            variant="bordered"
                                            value={formData.password}
                                            onValueChange={(val) => handleChange('password', val)}
                                            isInvalid={!!errors.password}
                                            errorMessage={errors.password}
                                        />
                                        <Input
                                            label="Confirm Password"
                                            placeholder="Confirm password"
                                            type="password"
                                            variant="bordered"
                                            value={formData.password_confirmation}
                                            onValueChange={(val) => handleChange('password_confirmation', val)}
                                            isInvalid={!!errors.password_confirmation}
                                            errorMessage={errors.password_confirmation}
                                        />
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit" isLoading={isLoading}>
                                    {user ? "Update User" : "Save User"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}