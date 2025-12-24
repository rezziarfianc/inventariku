import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { Search, RefreshCw, ChevronDown } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useTableStore } from "~/contexts/useTableStore";
import { useDebounce } from "~/hooks/useDebounce";

function FilterSearch() {
    const searchValue = useTableStore(state => state.filters.search || '');
    const setFilter = useTableStore(state => state.setFilter);
    const removeFilter = useTableStore(state => state.removeFilter);

    const [text, setText] = useState(searchValue);
    const debouncedSearch = useDebounce(text, 500);

    useEffect(() => {
        if (debouncedSearch) setFilter('search', debouncedSearch);
        else removeFilter('search');
    }, [debouncedSearch]);

    return (
        <Input
            value={text}
            onValueChange={setText}
            size="sm"
            placeholder="Search..."
            className="w-48"
            startContent={<Search size={14} className="text-default-400" />}
            variant="bordered"
            classNames={{
                inputWrapper: "bg-default-50",
            }}
        />
    );

}

export default memo(FilterSearch);