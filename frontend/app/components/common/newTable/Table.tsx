"use client";

import React, { memo, useCallback, useMemo } from "react";
import {
    Table as HeroUITable,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Spinner,
    Card,
    Tooltip
} from "@heroui/react";
import { useTableStore } from "~/contexts/newTableContext";

interface ActionItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    onClick: (item: any) => void;
    isHidden?: (item: any) => boolean;
}

interface TableProps {
    columns: any[];
    isLoading?: boolean;
    actions?: ActionItem[];
    renderCell?: (item: any, columnKey: any) => React.ReactNode;
}

function Table({ columns, actions = [], renderCell: customRenderCell }: TableProps) {
    // const { data, tableState: { isLoading } } = useNewTableContext();
    const data = useTableStore(state => state.data);
    const isLoading = useTableStore(state => state.isLoading);

    const itemsWithKey = useMemo(() => {
        return data.map((item: any, index: number) => ({
            ...item,
            key: item.key || item.id || item.user_id || `row-${index}`
        }));
    }, [data]);

    const renderCell = useCallback((item: any, columnKey: any) => {
        if (columnKey === "actions") {
            return (
                <div className="relative flex items-center gap-2">
                    {actions.map((action) => {
                        if (action.isHidden?.(item)) return null;

                        return (
                            <Tooltip key={action.key} content={action.label}>
                                <span
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                    onClick={() => action.onClick(item)}
                                >
                                    {action.icon}
                                </span>
                            </Tooltip>
                        );
                    })}
                </div>
            );
        }

        return customRenderCell ? customRenderCell(item, columnKey) : getKeyValue(item, columnKey);
    }, [actions, customRenderCell]);


    return (
        <Card className="w-full overflow-auto bg-white">
            <HeroUITable
                aria-label="Data Table"
                isHeaderSticky
                isStriped
                className="w-full overflow-auto"
            >
                <TableHeader columns={columns}>
                    {(column: any) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody
                    items={itemsWithKey}
                    isLoading={isLoading}
                    loadingContent={<Spinner label="Loading..." />}
                    emptyContent={!isLoading ? "No data found." : " "}
                >
                    {(item: any) => (
                        <TableRow key={item.key}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </HeroUITable>
        </Card>
    );
}

export default memo(Table);