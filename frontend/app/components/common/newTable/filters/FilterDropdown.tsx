import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { memo, useCallback } from "react";
import { useTableStore } from "~/contexts/newTableContext";


function FilterDropdown({ filterKey, items }: { filterKey: string, items: any[] }) {

    const setFilter = useTableStore(state => state.setFilter);
    const filters = useTableStore(state => state.filters);

    const handleFilter = useCallback((key: string, value: any) => {
        setFilter(key, value);
    }, [setFilter]);

    const currentValue = filters[filterKey] || '';

    return (
        <Dropdown  >
            <DropdownTrigger>
                <Button
                    startContent={<span className="text-default-400">{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}:</span>}
                    endContent={<ChevronDown size={12} className="text-default-600" />}
                    variant="flat"
                    size="sm"
                    className="bg-white text-default-600 min-w-16"
                >
                    {currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
                </Button>
            </DropdownTrigger>
            <DropdownMenu>
                {items.map((item: any) => (
                    <DropdownItem key={item.value} onClick={() => handleFilter(filterKey, item.value)}>
                        {item.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export default memo(FilterDropdown);