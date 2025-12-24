import React, { useEffect, useState, useMemo, type Key } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Tabs,
    Tab,
    Autocomplete,
    AutocompleteItem
} from "@heroui/react";
import { Form } from "react-router";
import * as productsApi from "~/apis/productsApi";
import { MoveDown, MoveUp, Search } from "lucide-react";
import type { Product } from "~/types/product";
import { useDebounce } from "~/hooks/useDebounce";

interface CreateStockFlowModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onClose: () => void;
    onSave: () => Promise<void>;
}

export default function CreateStockFlowModal({ isOpen, onOpenChange, onClose, onSave }: CreateStockFlowModalProps) {
    const size = "md";
    const [productId, setProductId] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [flowType, setFlowType] = useState<'inbound' | 'outbound'>('inbound');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Product Search State
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Debounce search query to avoid too many API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsSearching(true);
            try {
                // Using product_name param as requested
                // Cast api call params to ignore type error if types not updated yet
                const params: any = { per_page: 20 };
                if (debouncedSearchQuery) {
                    params.product_name = debouncedSearchQuery;
                }

                const response = await productsApi.getProducts(params);
                setProducts(response.products);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setIsSearching(false);
            }
        };

        if (debouncedSearchQuery !== undefined) {
            fetchProducts();
        }
    }, [debouncedSearchQuery]);

    useEffect(() => {
        if (isOpen) {
            setQuantity(0);
            setFlowType('inbound');
            setProductId('');
            setSearchQuery('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) {
            setError("Please select a product");
            return;
        }

        if (quantity <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        setIsLoading(true);
        try {
            await productsApi.manageStock(productId, quantity, flowType);
            await onSave(); // Refresh parent
            onClose();
        } catch (error: any) {
            console.error("Failed to create transaction", error);
            setError(error?.response?.data?.message || "Failed to create transaction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSelectionChange = (key: Key | null) => {
        setProductId(key as string);
        if (key) {
            const selectedProduct = products.find(p => p.product_id?.toString() === key.toString());
            if (selectedProduct) {
                setSearchQuery(selectedProduct.name);
            }
        }
    };

    const onInputChange = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} backdrop="blur" onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create Stock Transaction
                            <span className="text-small text-default-400 font-normal">
                                Search for a product and add or remove stock.
                            </span>
                        </ModalHeader>

                        <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Autocomplete
                                        label="Select Product"
                                        placeholder="Type to search product..."
                                        variant="bordered"
                                        items={products}
                                        inputValue={searchQuery}
                                        onInputChange={onInputChange}
                                        onSelectionChange={onSelectionChange}
                                        isLoading={isSearching}
                                        selectedKey={productId ? productId.toString() : undefined}
                                    >
                                        {(item) => (
                                            <AutocompleteItem key={item.product_id} textValue={item.name}>
                                                <div className="flex flex-col">
                                                    <span className="text-small">{item.name}</span>
                                                    <span className="text-tiny text-default-400">Current Stock: {item.quantity}</span>
                                                </div>
                                            </AutocompleteItem>
                                        )}
                                    </Autocomplete>

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
                                                <span>Add Stock (In)</span>
                                            </div>
                                        } />
                                        <Tab key="outbound" title={
                                            <div className="flex items-center space-x-2">
                                                <MoveUp size={16} />
                                                <span>Take Stock (Out)</span>
                                            </div>
                                        } />
                                    </Tabs>

                                    <Input
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
