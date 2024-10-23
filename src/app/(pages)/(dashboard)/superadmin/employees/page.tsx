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
import { LoaderIcon, User, XCircle } from "lucide-react";
import {
  getAllEmployees,
  deleteEmployee,
  FetchEmployeesResult,
  Employee,
} from "@/hooks/employee/employeesAction";
import {
  Department,
  getDepartments,
} from "@/hooks/department/departmentAction";

export type EmployeeStatus = "ACTIVE" | "UNACTIVE";
export type Type = 1 | 2 | 3 | 4;

export default function EnhancedDataTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const statusColor: Record<EmployeeStatus, string> = {
    ACTIVE: "bg-green-500 text-white",
    UNACTIVE: "bg-red-500 text-white",
  };
  const employeeType: Record<Type, string> = {
    1: "Superadmin",
    2: "Secretary",
    3: "Receptionist",
    4: "Division",
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      if (res.status) {
        setDepartments(res.data || []);
      } else {
        console.error("Failed to fetch departments:", res.message);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: FetchEmployeesResult = await getAllEmployees();
      try {
        if (response.success) {
          setEmployees(response.data);
        } else {
          console.error("Failed to fetch employees:", response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleDeleteEmployee = async (id: string) => {
    const result = await deleteEmployee(id);
    if (result) window.location.reload();
  };

  const columns: ColumnDef<Employee>[] = [
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
      accessorKey: "employee_id",
      header: () => <div className="text-center">Employee Id</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("employee_id")}
        </div>
      ),
    },
    {
      accessorKey: "employee_name",
      header: () => <div className="text-center">Employee Name</div>,
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.getValue("employee_name")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as EmployeeStatus;
        const colorClass = statusColor[status] || "";
        return (
          <div className="flex justify-center items-center">
            <Badge
              className={`font-bold ${colorClass} rounded hover:bg-green-600`}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: () => <div className="text-center">Phone Number</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("phone_number")}</div>
      ),
    },
    {
      accessorKey: "gender",
      header: () => <div className="text-center">Gender</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("gender")}</div>
      ),
    },
    {
      accessorKey: "employee_type_id",
      header: () => <div className="text-center">Employee Type</div>,
      cell: ({ row }) => {
        const type = row.getValue("employee_type_id") as number;
        const typeClass = employeeType[type as Type] || "";
        return <div className="text-center">{typeClass}</div>;
      },
      filterFn: (row, columnId, value) => {
        const typeId = row.getValue(columnId);
        return value === "" || typeId === Number(value);
      },
    },
    {
      accessorKey: "department_id",
      header: () => <div className="text-center">Department</div>,
      cell: ({ row }) => {
        const departmentId = row.getValue("department_id") as number;
        const departmentName =
          departments.find((dep) => dep.department_id === departmentId)
            ?.department_name || "Unknown";
        return <div className="text-center">{departmentName}</div>;
      },
      filterFn: (row, columnId, value) => {
        const departmentId = row.getValue(columnId);
        return value === "" || departmentId === Number(value);
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original;
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
                onClick={() =>
                  navigator.clipboard.writeText(employee.employee_id)
                }>
                Copy Employee ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-center">
                <Link
                  href={`/superadmin/employees/${employee.employee_id}/update`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-center">
                <Link
                  href="#"
                  onClick={() => handleDeleteEmployee(employee.employee_id)}>
                  Delete
                </Link>
              </DropdownMenuItem>
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
    data: employees,
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
      {/* top section*/}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter employee names..."
          value={
            (table.getColumn("employee_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("employee_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="p-1 space-x-2">
          <Link
            href="/superadmin/register"
            className="p-3 rounded-md bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc] cursor-pointer text-white font-medium text-sm">
            Add Employee
          </Link>

          <select
            value={
              (table.getColumn("employee_type_id")?.getFilterValue() as Type) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("employee_type_id")
                ?.setFilterValue(event.target.value)
            }
            className="text-[12px] border border-gray-300 rounded-md text-gray-600 h-10 p-2 bg-white hover:border-gray-400 focus:outline-none">
            <option value="">All Employee Types</option>
            {Object.entries(employeeType).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          <select
            value={
              (table.getColumn("department_id")?.getFilterValue() as number) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("department_id")
                ?.setFilterValue(event.target.value)
            }
            className="border text-[12px] border-gray-300 rounded-md text-gray-600 h-10 p-2 bg-white hover:border-gray-400 focus:outline-none">
            <option value="">All Departments</option>
            {departments.map((dep) => (
              <option key={dep.department_id} value={dep.department_id}>
                {dep.department_name}
              </option>
            ))}
          </select>

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
      {/* table section*/}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-96">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <User className="h-12 w-12 text-gray-300 animate-pulse" />
                      <LoaderIcon className="h-6 w-6 text-blue-500 animate-spin absolute -top-1 -right-1" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Loading employees...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors duration-200">
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
                <TableCell colSpan={columns.length} className="h-96">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <User className="h-12 w-12 text-gray-300 " />
                      <XCircle className="h-6 w-6 text-gray-400 absolute -top-1 -right-1" />
                    </div>
                    <p className="text-gray-500 text-sm">No employees found</p>
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

      {/* footer section*/}
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
