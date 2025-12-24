import { Pagination, Dropdown, DropdownItem, DropdownTrigger, Button, DropdownMenu } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { memo } from "react";
import { useTableStore } from "~/contexts/useTableStore";

interface PaginationProps {
    dropdownItems?: number[],
}

function TablePagination({ dropdownItems = [5, 10, 15, 50] }: PaginationProps) {
    const page = useTableStore((state) => state.page);
    const setPage = useTableStore((state) => state.setPage);
    const limit = useTableStore((state) => state.limit);
    const setLimit = useTableStore((state) => state.setLimit);
    const totalItems = useTableStore((state) => state.totalItems);

    const totalPages = Math.ceil(totalItems / limit) || 1;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalItems);

    return (
        <div className="flex flex-col md:flex-row justify-end items-center w-full mt-4 p-2 gap-4">
            <span className="text-small text-default-600">
                Showing {Math.min(start, totalItems)} - {end} out of {totalItems} items
            </span>

            <div className="flex gap-2 items-center">
                <span className="text-default-600 text-small">Rows per page:</span>
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            endContent={<ChevronDown size={12} className="text-default-600" />}
                            variant="flat"
                            size="sm"
                            className="bg-default-100 text-default-600 min-w-16"
                        >
                            {limit}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Rows per page"
                        onAction={(key) => setLimit(Number(key))}
                        selectedKeys={[String(limit)]}
                        selectionMode="single"
                    >
                        {dropdownItems.map((num) => (
                            <DropdownItem key={num}>
                                {num}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>

            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
            />
        </div>
    );
}


export default memo(TablePagination);