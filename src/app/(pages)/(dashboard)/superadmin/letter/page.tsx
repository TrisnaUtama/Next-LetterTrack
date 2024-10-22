"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoaderIcon } from "lucide-react";

import { getLetter, Letter } from "@/hooks/letter/letterAction";

export default function EnhancedDataTable() {
  const [letter, setLetter] = useState<Letter[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getLetter();
      if (response.success) {
        setLetter(response.data);
      } else {
        console.error("Failed to fetch letter:", response.message);
      }
    };
    fetchData();
  }, []);

  const columns: ColumnDef<Letter>[] = [
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
      accessorKey: "letter_id",
      header: () => <div className="text-center">Letter ID</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("letter_id")}
        </div>
      ),
    },
    {
      accessorKey: "letter",
      header: () => <div className="text-center">Letter Date</div>,
      cell: ({ row }) => {
        return (
          <div className="font-medium text-center">
            {new Date(row.original.letter.letter_date).toDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "letter_type",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Letter Type
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.original.letter.letter_type.letter_type}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const letterTypeA =
          rowA.original.letter?.letter_type?.letter_type || "";
        const letterTypeB =
          rowB.original.letter?.letter_type?.letter_type || "";
        return letterTypeA.localeCompare(letterTypeB);
      },
    },
    {
      accessorKey: "descriptions",
      header: () => <div className="text-center">Description</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.letter.descriptions}</div>
        );
      },
    },
    {
      accessorKey: "isSigned",
      header: () => <div className="text-center">Signed</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("isSigned") == false ? (
            <Badge
              className={`text-center font-bold bg-red-500 rounded hover:bg-red-600`}>
              Not Signed
            </Badge>
          ) : (
            <Badge
              className={`text-center font-bold bg-green-500 rounded hover:bg-green-600`}>
              Signed
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "signed_date",
      header: () => <div className="text-center">Signed Date</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("signed_date")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const letter = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex justify-center cursor-pointer"
                onClick={() => navigator.clipboard.writeText(letter.letter_id)}>
                Copy Letter ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-center">
                <Link href={`/superadmin/letter/${letter.letter_id}/update`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: letter,
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
    <div className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter letter ID..."
          value={
            (table.getColumn("letter_id")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("letter_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="p-1 space-x-2">
          <Link
            href="/superadmin/register"
            className="p-3 rounded-md bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc] cursor-pointer text-white font-medium text-sm">
            Add Letter
          </Link>

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
            className="border text-[12px] border-gray-300 rounded-md text-gray-600 h-10 p-2 bg-white hover:border-gray-400 focus:outline-none">
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={`${row.id}-${rowIndex}`}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell key={`${cell.id}-${cellIndex}`}>
                      {" "}
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
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex justify-center items-center">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    <p className="m-2">Loading...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-700">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(prev.pageIndex - 1, 0),
              }))
            }
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.min(
                  prev.pageIndex + 1,
                  table.getPageCount() - 1
                ),
              }))
            }
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
