"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ConfirmationDialog from "../ConfirmationDialog";

import { get_division, Division } from "@/hooks/organizations/division_action";

import EditDialog from "../EditDialog";
import AddOrganizationsDialog from "../AddDialog";
const ActionCell: React.FC<{ division: Division }> = ({ division }) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {confirmationOpen && (
        <ConfirmationDialog
          id={division.division_id}
          type="Division"
          onClose={() => setConfirmationOpen(false)}
        />
      )}
      {isEditing && (
        <EditDialog
          type="Division"
          id={division.division_id}
          onClose={() => setIsEditing(false)}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmationOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Division>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "division_name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Division
            <ArrowUpDown className="w-3" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.original.division_name}</div>
    ),
  },
  {
    accessorKey: "head_division",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            Head Division
            <ArrowUpDown className="w-3" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center lowercase">{row.original.head_division}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell division={row.original} />,
  },
];

export function TableDivision() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [division, setDivision] = useState<Division[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await get_division();
        setDivision(response.data!);
      } catch (error: any) {
        setDivision([]);
        console.error(error.message);
      }
    };
    fetch();
  }, []);

  const table = useReactTable({
    data: division,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter division..."
          value={
            (table.getColumn("division_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("division_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="p-1 space-x-2">
          <Button
            className="bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc]"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Division
          </Button>
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPagination((prev) => ({
                ...prev,
                pageSize: newSize,
                pageIndex: 0,
              }));
            }}
            className="border text-sm border-gray-300 rounded-md text-gray-600 
            p-2 bg-white hover:border-gray-400 focus:outline-none"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto text-black/50 text-sm"
              >
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {isDialogOpen && (
        <AddOrganizationsDialog
          onClose={() => setIsDialogOpen(false)}
          type="Division"
        />
      )}
    </div>
  );
}
