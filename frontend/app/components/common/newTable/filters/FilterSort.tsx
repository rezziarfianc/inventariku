import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { memo } from "react";
import { useTableStore } from "~/contexts/newTableContext";
import type { Sort } from "~/types/common"

function FilterSort({ items }: { items: Sort[] }) {
    const setSort = useTableStore(state => state.setSort);
    const sort = useTableStore(state => state.sort);

    const currentValue = sort.label;

    return (
        <Dropdown  >
            <DropdownTrigger>
                <Button
                    startContent={<span className="text-default-400">Sort: </span>}
                    endContent={<ChevronDown size={12} className="text-default-600" />}
                    variant="flat"
                    size="sm"
                    className="bg-white text-default-600 min-w-16"
                >
                    {currentValue}
                </Button>
            </DropdownTrigger>
            <DropdownMenu>
                {items.map((item: any) => (
                    <DropdownItem key={item.value} onClick={() => setSort(item)}>
                        {item.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export default memo(FilterSort);