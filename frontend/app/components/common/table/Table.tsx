"use client";

import React, { useCallback } from "react";
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
import { useTableContext } from "~/contexts/tableContext";
import moment from "moment";

interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: (item: any) => void;
  isHidden?: (item: any) => boolean;
}

interface TableProps {
  isLoading?: boolean;
  actions?: ActionItem[];
  renderCell?: (item: any, columnKey: any) => React.ReactNode;
}

export default function Table({ isLoading = false, actions = [], renderCell: customRenderCell }: TableProps) {
  const { columns, items } = useTableContext();

  const itemsWithKey = React.useMemo(() => {
    return items.map((item: any, index: number) => ({
      ...item,
      key: item.key || item.id || item.user_id || `row-${index}`
    }));
  }, [items]);

  const renderCell = useCallback((item: any, columnKey: any) => {
    if (columnKey === "created_at") {
      return item.created_at ? moment(item.created_at).format("DD MMM YYYY") : "-";
    }
    if (columnKey === "updated_at") {
      return item.updated_at ? moment(item.updated_at).format("DD MMM YYYY") : "-";
    }
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

    if (customRenderCell) {
      const result = customRenderCell(item, columnKey);
      if (result !== undefined) return result;
    }

    const cellValue = getKeyValue(item, columnKey);

    if (Array.isArray(cellValue)) {
      return cellValue.join(", ");
    }

    if (typeof cellValue === "object" && cellValue !== null) {
      if (React.isValidElement(cellValue)) {
        return cellValue;
      }
      return JSON.stringify(cellValue);
    }

    return cellValue;
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