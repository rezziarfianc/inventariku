import { Pagination, Dropdown, DropdownItem, DropdownTrigger, Button, DropdownMenu } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useTableContext } from "~/context/tableContext";

interface PaginationProps {
    dropdownItems?: number[],
}

export default function TablePagination({ dropdownItems = [5, 10, 15, 50] }: PaginationProps) {
    const {
        page,
        setPage,
        totalItems,
        rowsPerPage,
        setRowsPerPage
    } = useTableContext();

    const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, totalItems);

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
                            {rowsPerPage}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Rows per page"
                        onAction={(key) => setRowsPerPage(Number(key))}
                        selectedKeys={[String(rowsPerPage)]}
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