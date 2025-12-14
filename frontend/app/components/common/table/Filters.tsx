import { useEffect, useState } from "react";
import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { Search, RefreshCw, ChevronDown } from "lucide-react";
import { useTableContext } from "~/context/tableContext";
import { useDebounce } from "~/hooks/useDebounce";

export default function Filters() {
    const {
        search, // Global search from context
        setPage,
        setSearch,
        setSortDescriptor,
        sortDescriptor,
        sortOptions = [],
        statusFilter,
        setStatusFilter,
        statusOptions = [],
        refresh,
        statusLabel = "Status"
    } = useTableContext();

    // Local state for immediate input feedback
    const [localSearch, setLocalSearch] = useState(search || "");
    const debouncedSearch = useDebounce(localSearch, 500);

    useEffect(() => {
        setLocalSearch(search || "");
    }, [search]);

    // Update global search when debounced value changes
    useEffect(() => {
        if (debouncedSearch !== search) {
            setSearch(debouncedSearch);
            setPage(1);
        }
    }, [debouncedSearch]);


    const handleStatusFilter = (key: string) => {
        if (setStatusFilter) {
            setStatusFilter(key);
            setPage(1);
        }
    };

    const handleSort = (key: string) => {
        const selected = sortOptions.find(s => s.label === key);
        if (selected) {
            setSortDescriptor({ column: selected.key, direction: selected.direction as "ascending" | "descending" });
        }
        setPage(1);
    };

    const handleRefresh = () => {
        if (refresh) {
            refresh();
        }
    }

    const handleSearch = (input: string) => {
        setLocalSearch(input);
        // Page reset handles in effect
    }

    const currentSortLabel = sortOptions.find(
        (s) => s.key === sortDescriptor.column && s.direction === sortDescriptor.direction
    )?.label ?? sortDescriptor.column;

    return (
        <Card className="mb-4 p-1 self-end w-fit">
            <CardBody className="flex flex-row items-center gap-2">
                <Input
                    value={localSearch}
                    onValueChange={handleSearch}
                    size="sm"
                    placeholder="Search..."
                    className="w-48"
                    startContent={<Search size={14} className="text-default-400" />}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "bg-default-50",
                    }}
                />

                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            className="text-default-600"
                            variant="light"
                            size="sm"
                            startContent={<span className="text-default-400">Sort:</span>}
                            endContent={<ChevronDown size={14} className="text-default-400" />}
                        >
                            {currentSortLabel}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Sort actions" onAction={(key) => handleSort(key as string)}>
                        {sortOptions.map((sort) => (
                            <DropdownItem key={sort.label}>
                                {sort.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {statusOptions.length > 0 && (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="text-default-600"
                                variant="light"
                                size="sm"
                                startContent={<span className="text-default-400">{statusLabel}:</span>}
                                endContent={<ChevronDown size={14} className="text-default-400" />}
                            >
                                {statusOptions.find(o => o.value === statusFilter)?.label || "All"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Status filters"
                            onAction={(key) => handleStatusFilter(key as string)}
                            selectedKeys={statusFilter ? [statusFilter] : []}
                            selectionMode="single"
                            items={[
                                { value: "", label: `All ${statusLabel}` },
                                ...statusOptions
                            ]}
                        >
                            {(item) => (
                                <DropdownItem key={item.value}>
                                    {item.label}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                )}

                <div className="w-px h-6 bg-default-200 mx-1" />

                <Button
                    onPress={handleRefresh}
                    isIconOnly
                    className="text-default-500"
                    variant="light"
                    size="sm"
                >
                    <RefreshCw size={14} />
                </Button>
            </CardBody>
        </Card>
    );
}