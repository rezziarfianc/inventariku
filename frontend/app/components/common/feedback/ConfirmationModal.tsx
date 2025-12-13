import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onOpenChange,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
}: ConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <ModalBody>
                            <p>{message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                {cancelText}
                            </Button>
                            <Button color="danger" onPress={onConfirm} isLoading={isLoading}>
                                {confirmText}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
