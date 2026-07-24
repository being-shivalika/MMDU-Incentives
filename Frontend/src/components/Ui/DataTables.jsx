import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Eye,
  SlidersHorizontal,
  Download,
} from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils/cn";

export const DataTable = ({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  onRowClick,
  bulkActions,
  exportPlaceholder = false,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  ("");
  const allColumns = table.getAllColumns();

  return (
    <div className="space-y-4 gap-6">
      {/* Header controls (Search, Filters, Column Visibility, Exports) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 border border-brand-gray-200 rounded-t-lg">
        {searchKey && (
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-brand-gray-400" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 pl-9 pr-4 w-full bg-white border border-brand-gray-200 rounded text-sm text-brand-gray-900 transition-colors focus:border-black"
            />
          </div>
        )}

        <div className="flex items-center gap-2 self-end md:self-auto">
          {bulkActions && (
            <div className="flex items-center gap-2">{bulkActions}</div>
          )}

          {exportPlaceholder && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("CSV Export Triggered (Placeholder)")}
              className="h-9 text-xs flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}

          {/* Column Visibility Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              className="h-9 text-xs flex items-center gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Columns
            </Button>

            {showVisibilityMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-gray-200 shadow-xl rounded-lg py-1.5 z-40 text-left max-h-56 overflow-y-auto no-scrollbar">
                <div className="px-3 py-1.5 border-b border-brand-gray-150 mb-1 text-[10px] font-bold text-brand-gray-400 uppercase">
                  Toggle Columns
                </div>
                {allColumns.map((column) => {
                  if (column.id === "actions") return null;
                  return (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-brand-gray-50 text-xs font-semibold text-brand-gray-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded border-brand-gray-300 text-black focus:ring-black"
                      />
                      <span>{column.columnDef.header}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border-x border-b border-brand-gray-200 rounded-b-lg">
        <table className="min-w-full divide-y divide-brand-gray-200 text-left text-xs bg-white">
          <thead className="bg-brand-gray-50 text-brand-gray-600 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-brand-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3.5 font-bold">
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-1.5 hover:text-black"
                            : "",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="h-3 w-3 shrink-0" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-brand-gray-150 text-brand-gray-700 font-medium ">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-brand-gray-400"
                >
                  No matching claims found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={cn(
                    "hover:bg-brand-gray-50/50 transition-colors",
                    onRowClick ? "cursor-pointer" : "",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4.5 max-w-md truncate">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="text-brand-gray-400 font-medium">
          Showing Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1} ({table.getFilteredRowModel().rows.length}{" "}
          total rows)
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-brand-gray-400 font-medium">
              Rows per page:
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border border-brand-gray-200 rounded px-1.5 py-0.5 font-medium text-brand-gray-800 bg-white"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
