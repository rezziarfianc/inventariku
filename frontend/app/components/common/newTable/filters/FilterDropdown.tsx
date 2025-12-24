import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useTableStore } from "~/contexts/useTableStore";
import { capitalize } from "~/libs/utils";


function FilterDropdown({ filterKey, items }: { filterKey: string, items: any[] }) {

    const [filterLabel, setFilterLabel] = useState<string>('all');
    const setFilter = useTableStore(state => state.setFilter);
    const filters = useTableStore(state => state.filters);

    const handleFilter = useCallback((key: string, value: any, label: string) => {
        setFilterLabel(label);
        setFilter(key, value);
    }, [setFilter]);

    return (
        <Dropdown  >
            <DropdownTrigger>
                <Button
                    startContent={<span className="text-default-400">{capitalize(filterKey)}:</span>}
                    endContent={<ChevronDown size={12} className="text-default-600" />}
                    variant="flat"
                    size="sm"
                    className="bg-white text-default-600 min-w-16"
                >
                    {capitalize(filterLabel || filterLabel || 'All')}
                </Button>
            </DropdownTrigger>
            <DropdownMenu>
                {items.map((item: any) => (
                    <DropdownItem key={item.value} onClick={() => handleFilter(filterKey, item.value, item.label)}>
                        {capitalize(item.label)}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export default memo(FilterDropdown);