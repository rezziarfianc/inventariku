import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { memo, useEffect, useState, type Key } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import type { Product } from "~/types/product";
import { getProducts } from "~/apis/productsApi";

interface ProductFilterProps {
    onSelect?: (key: string | null) => void
}

function ProductFilter({ onSelect = () => { } }: ProductFilterProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [productId, setProductId] = useState<number | null>(null);
    const debouncedSearch = useDebounce(searchQuery, 500);

    const onInputChange = (value: string) => {
        console.log(value, searchQuery);
        setSearchQuery(prev => prev === value ? prev : value);
    };


    const onSelectionChange = (key: Key | null) => {
        if(key === productId) return;
        setProductId(key as number);
        if (key) {
            const selectedProduct = products.find(p => p.product_id?.toString() === key.toString());
            if (selectedProduct) {
                setSearchQuery(selectedProduct.name);
            }
            onSelect(key as string);
        }
        else {
            onSelect(null);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {

            if (debouncedSearch === "") return;

            setIsSearching(true);
            try {
                const params: any = { per_page: 20 };
                if (debouncedSearch) {
                    params.product_name = debouncedSearch;
                }
                const response = await getProducts(params);
                setProducts(response.products);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        };
        fetchProducts();
    }, [debouncedSearch]);

    return (<div>
        <Autocomplete
            label="Product"
            placeholder="Type to search product..."
            className="bg-white"
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
    </div>);
}

export default memo(ProductFilter);