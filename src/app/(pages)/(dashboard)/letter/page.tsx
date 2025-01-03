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
import SignLetterDialog from "@/components/SignedLetterDialog";
import { getLetter, Letter } from "@/hooks/letter/letterAction";
import { Employee, userLogin } from "@/hooks/(auth)/login/loginAction";

export default function EnhancedDataTable() {
  const [letter, setLetter] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFiltered, setLetterFiltered] = useState<Letter[]>([]);
  const [employeeLogin, setEmployeeLogin] = useState<Employee>();
  const [detailLetterOpen, setDetailLetterOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      const filteredLetters = letter.filter(
        (l) => l.letter.status !== "FINISH"
      );
      const fetchUser = await userLogin();
      setEmployeeLogin(fetchUser.data);
      setLetterFiltered(filteredLetters);
    };
    fetchData();
  }, [letter]);

  const LetterStatusMapping = {
    ON_PROGRESS: "IN PROGRESS",
    FINISH: "DONE",
    HIDE: "HIDE",
  };

  const SignatureStatus = {
    NOT_ARRIVE: "NOT ARRIVE",
    ARRIVE: "ARRIVE",
    SIGNED: "SIGNED",
  };

  const uniqueLetterIds = new Set(letter.map((sig) => sig.letter_id));

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
          {row.original.letter_id}
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
            className="font-semibold text-gray-700 hover:bg-gray-100"
          >
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
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.letter.status === "ON_PROGRESS" ? (
              <Badge className="text-center font-bold bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                <LoaderIcon className="w-3 h-3 mr-1 animate-spin" />
                {LetterStatusMapping.ON_PROGRESS}
              </Badge>
            ) : row.original.letter.status === "HIDE" ? (
              <Badge className="text-center text-white font-bold bg-gray-500 hover:bg-gray-600 transition-colors duration-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {LetterStatusMapping.HIDE}
              </Badge>
            ) : (
              <Badge className="text-center font-bold bg-green-500 hover:bg-green-600 transition-colors duration-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {LetterStatusMapping.FINISH}
              </Badge>
            )}
          </div>
        );
      },
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
      accessorKey: "organization",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-semibold text-gray-700 hover:bg-gray-100"
          >
            Organization
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-gray-600 max-w-xs truncate">
          <Badge
            className={`p-2 ${
              row.original.Deputy
                ? "bg-gray-400 hover:bg-gray-500"
                : row.original.Division
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-800 rounded-md"
                : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
            }`}
          >
            {row.original.Deputy
              ? row.original.Deputy.deputy_name
              : row.original.Division
              ? row.original.Division.division_name
              : row.original.department.department_name}
          </Badge>
        </div>
      ),
      sortingFn: (a, b) => {
        const valueA =
          a.original.Deputy?.deputy_name ||
          a.original.Division?.division_name ||
          a.original.department?.department_name ||
          "";

        const valueB =
          b.original.Deputy?.deputy_name ||
          b.original.Division?.division_name ||
          b.original.department?.department_name ||
          "";
        return valueA.localeCompare(valueB);
      },
    },
    {
      accessorKey: "status_signed",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-semibold text-gray-700 hover:bg-gray-100"
          >
            Sign Status
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {row.original.status === "ARRIVE" ? (
              <Badge className="text-center font-bold bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Arrive
              </Badge>
            ) : row.original.status === "NOT_ARRIVE" ? (
              <Badge className="text-center font-bold bg-red-500 hover:bg-red-600 transition-colors duration-200">
                <XCircle className="w-3 h-3 mr-1" />
                Not Arrive
              </Badge>
            ) : (
              <Badge className="text-center font-bold bg-green-500 hover:bg-green-600 transition-colors duration-200">
                <XCircle className="w-3 h-3 mr-1" />
                Signed
              </Badge>
            )}
          </div>
        );
      },
      sortingFn: (a, b) => {
        const valueA = a.original.status;
        const valueB = b.original.status;
        return valueA.localeCompare(valueB);
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const letter = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="action"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel className="text-center font-semibold">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                id="copy-letter"
                className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  navigator.clipboard.writeText(letter.letter_id);
                  toast({
                    variant: "success",
                    title: "Success Copying",
                    description: `successfuly copy letter id ${letter.letter_id}`,
                  });
                }}
              >
                Copy Letter ID
              </DropdownMenuItem>

              {employeeLogin?.employee_type_id != 4 &&
                employeeLogin?.employee_type_id != 2 && (
                  <div>
                    <DropdownMenuSeparator />
                    <Link
                      id="edit"
                      href={`/letter/${letter.letter_id}/edit`}
                      className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-sm p-1.5 rounded-md"
                    >
                      Edit
                    </Link>
                  </div>
                )}

              {employeeLogin?.employee_type_id != 4 && (
                <div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    id="signed"
                    onClick={() => setIsOpen(true)}
                    className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    disabled={
                      letter.status == "SIGNED" || letter.status == "NOT_ARRIVE"
                    }
                  >
                    {letter.status == "SIGNED"
                      ? "Already Signed"
                      : letter.status == "NOT_ARRIVE"
                      ? "Wait The Letter"
                      : "Sign Letter"}
                  </DropdownMenuItem>
                </div>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                id="detail"
                className="flex justify-center"
                onSelect={() => setDetailLetterOpen(true)}
              >
                Detail Letter
              </DropdownMenuItem>
            </DropdownMenuContent>
            {/* Dialog Detail Letter */}
            {detailLetterOpen && (
              <LetterDetailDialog
                letter={letter}
                onClose={() => setDetailLetterOpen(false)}
              />
            )}
            {/* Dialog Sign Letter */}
            {isOpen && (
              <SignLetterDialog
                letter_id={row.original.letter_id}
                onClose={() => setIsOpen(false)}
                signature_id={Number(row.original.signature_id)}
                department_id_current={Number(letter.department?.department_id)}
                division_id_current={Number(letter.Division?.division_id)}
                deputy_id_current={Number(letter.Deputy?.deputy_id)}
              />
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [letterStatus, setLetterStatus] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: searchTerm.length > 0 ? letter : letterFiltered,
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
              <p className="text-2xl font-semibold">{uniqueLetterIds.size}</p>
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
                {
                  letter.filter(
                    (l) => l.letter.status === "FINISH" && uniqueLetterIds
                  ).length
                }
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
                {letter.filter((l) => l.status == "SIGNED").length}
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
            id="status"
            value={letterStatus}
            onChange={(e) => {
              const status = e.target.value;
              setLetterStatus(e.target.value);

              if (status) {
                const filteredLetters = letter.filter(
                  (l) => l.status === status
                );
                setLetterFiltered(filteredLetters);
              } else {
                setLetterFiltered(letter);
              }
            }}
            className="border border-gray-200 rounded-md text-gray-600 h-10 pl-3 pr-8 bg-white hover:border-gray-400 focus:outline-none transition-colors duration-200 text-sm"
          >
            <option value="">All Status</option>
            {Object.entries(SignatureStatus).map(([key, value]) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                pageIndex: 0,
              }));
            }}
            className="border border-gray-200 rounded-md text-gray-600 
            h-10 pl-3 pr-8 bg-white hover:border-gray-400 
            focus:outline-none transition-colors duration-200 text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {employeeLogin?.employee_type_id != 4 && (
            <Link
              href={`/letter/${employeeLogin?.department_id}/add`}
              className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc] cursor-pointer text-white font-medium text-sm transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Letter
            </Link>
          )}
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
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
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
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
