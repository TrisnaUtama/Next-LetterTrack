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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  LoaderIcon,
  Search,
  Plus,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LetterDetailDialog from "@/components/LetterDetailDialog/Dialog";

import { getLetter, Letter } from "@/hooks/letter/letterAction";

export default function EnhancedDataTable() {
  const [letter, setLetter] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLetter();
        if (response.success) {
          setLetter(response.data);
        } else {
          console.error("Failed to fetch letter:", response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const LetterStatusMapping = {
    ON_PROGRESS: "ON PROGRESS",
    FINISH: "DONE",
  };

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
          className="transition-all duration-200 hover:scale-110"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="transition-all duration-200 hover:scale-110"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "letter_id",
      header: () => (
        <div className="text-center font-semibold text-gray-700">Letter ID</div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
          {row.getValue("letter_id")}
        </div>
      ),
    },
    {
      accessorKey: "letter",
      header: () => (
        <div className="text-center font-semibold text-gray-700">
          Letter Date
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium text-center text-gray-600">
            {new Date(row.original.letter.letter_date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-semibold text-gray-700 hover:bg-gray-100">
            Letter Type
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium text-gray-600">
            {row.original.letter.letter_type.letter_type}
          </div>
        );
      },
      sortingFn: (a, b) => {
        const valueA = a.original.letter.letter_type.letter_type;
        const valueB = b.original.letter.letter_type.letter_type;
        return valueA.localeCompare(valueB);
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center font-semibold text-gray-700">Status</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.letter.status === "ON_PROGRESS" ? (
            <Badge className="text-center font-bold bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
              <LoaderIcon className="w-3 h-3 mr-1 animate-spin" />
              {LetterStatusMapping.ON_PROGRESS}
            </Badge>
          ) : (
            <Badge className="text-center font-bold bg-green-500 hover:bg-green-600 transition-colors duration-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {LetterStatusMapping.FINISH}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "From",
      header: () => (
        <div className="text-center font-semibold text-gray-700">From</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center text-gray-600">
            {row.original.letter.sender}
          </div>
        );
      },
    },
    {
      accessorKey: "subject",
      header: () => (
        <div className="text-center font-semibold text-gray-700">Subject</div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-gray-600 max-w-xs truncate">
          {row.original.letter.subject}
        </div>
      ),
    },
    {
      accessorKey: "isSigned",
      header: () => (
        <div className="text-center font-semibold text-gray-700">Signed</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.isSigned ? (
            <Badge className="text-center font-bold bg-green-500 hover:bg-green-600 transition-colors duration-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Signed
            </Badge>
          ) : (
            <Badge className="text-center font-bold bg-red-500 hover:bg-red-600 transition-colors duration-200">
              <XCircle className="w-3 h-3 mr-1" />
              Not Signed
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const letter = row.original;
        const [alertSignOpen, setAlertSignOpen] = useState(false);
        const [isSigningInProgress, setIsSigningInProgress] = useState(false);
        const [detailLetterOpen, setDetailLetterOpen] = useState(false);

        const handleCancel = () => {
          setIsSigningInProgress(false);
          window.location.reload();
        };

        const handleSign = async () => {
          setIsSigningInProgress(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            window.location.reload();
          } catch (error) {
            console.error("Error signing letter:", error);
          } finally {
            setIsSigningInProgress(false);
            setAlertSignOpen(false);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel className="text-center font-semibold">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  navigator.clipboard.writeText(letter.letter_id);
                  toast({
                    variant: "success",
                    title: "Success",
                    description: `successfuly copy letter id ${letter.letter_id}`,
                  });
                }}>
                Copy Letter ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onSelect={() => setAlertSignOpen(true)}
                disabled={letter.isSigned}>
                {letter.isSigned ? "Already Signed" : "Sign Letter"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="felx justify-center"
                onSelect={() => setDetailLetterOpen(true)}>
                Detail Letter
              </DropdownMenuItem>
            </DropdownMenuContent>
            {/* Dialog Detail Letter */}
            {detailLetterOpen && <LetterDetailDialog letter={letter} />}
            {/* Alert Dialog Confirmation Sign Letter*/}
            <AlertDialog open={alertSignOpen} onOpenChange={setAlertSignOpen}>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-semibold">
                    Confirm Letter Signing
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600">
                    This action cannot be undone. This will permanently sign the
                    letter and update its status in the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="space-x-2">
                  <AlertDialogCancel
                    className="hover:bg-gray-100 transition-colors duration-200"
                    disabled={isSigningInProgress}
                    onClick={handleCancel}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    onClick={handleSign}
                    disabled={isSigningInProgress}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                    {isSigningInProgress ? (
                      <>
                        <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      "Confirm Sign"
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Letters</p>
              <p className="text-2xl font-semibold">{letter.length}</p>
            </div>
            <Mail className="h-10 w-10 text-blue-500 transition-transform transform hover:scale-110" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold">
                {letter.filter((l) => l.letter.status === "ON_PROGRESS").length}
              </p>
            </div>
            <LoaderIcon className="h-10 w-10 text-amber-500  animate-spin" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold">
                {letter.filter((l) => l.letter.status === "FINISH").length}
              </p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-500 transition-transform transform hover:scale-110" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Signed</p>
              <p className="text-2xl font-semibold">
                {letter.filter((l) => l.isSigned).length}
              </p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-blue-500 transition-transform transform hover:scale-110" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search letters..."
              value={
                (table.getColumn("letter_id")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table
                  .getColumn("letter_id")
                  ?.setFilterValue(event.target.value);
                setSearchTerm(event.target.value);
              }}
              className="pl-8 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                pageIndex: 0,
              }));
            }}
            className="border border-gray-200 rounded-md text-gray-600 h-10 pl-3 pr-8 bg-white hover:border-gray-400 focus:outline-none transition-colors duration-200 text-sm">
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          <Link
            href="/superadmin/register"
            className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc] cursor-pointer text-white font-medium text-sm transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Letter
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-4">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-96">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <Mail className="h-12 w-12 text-gray-300 animate-pulse" />
                      <LoaderIcon className="h-6 w-6 text-blue-500 animate-spin absolute -top-1 -right-1" />
                    </div>
                    <p className="text-gray-500 text-sm">Loading letters...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={`${row.id}-${rowIndex}`}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors duration-200">
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell key={`${cell.id}-${cellIndex}`} className="py-3">
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
                <TableCell colSpan={columns.length} className="h-96">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <Mail className="h-12 w-12 text-gray-300" />
                      <XCircle className="h-6 w-6 text-gray-400 absolute -top-1 -right-1" />
                    </div>
                    <p className="text-gray-500 text-sm">No letters found</p>
                    {searchTerm && (
                      <p className="text-gray-400 text-xs">
                        Try adjusting your search terms
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} letter(s) selected
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="hover:bg-gray-100 transition-colors duration-200">
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="hover:bg-gray-100 transition-colors duration-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
