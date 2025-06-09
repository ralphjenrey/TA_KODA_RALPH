"use client"

import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Filter, MoreHorizontal, Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Unit = {
    id: string
    unitName: string
    unitType: string
    location: string
    vehicleReg: string
    status: "Enabled" | "Disabled"
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    addButtonText?: string
    onAddClick?: () => void
    onShowFiltersClick?: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search...",
    addButtonText = "Add Item",
    onShowFiltersClick,
    onAddClick,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [showFilters, setShowFilters] = React.useState(false)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const currentPage = table.getState().pagination.pageIndex + 1
    const totalPages = table.getPageCount()

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i)
                }
                pageNumbers.push('ellipsis')
                pageNumbers.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1)
                pageNumbers.push('ellipsis')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i)
                }
            } else {
                pageNumbers.push(1)
                pageNumbers.push('ellipsis')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i)
                }
                pageNumbers.push('ellipsis')
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    const handleShowFilters = () => {
        setShowFilters(!showFilters)
    }

    const clearAllFilters = () => {
        table.resetColumnFilters()
    }


    return (
        <div className="w-full bg-white p-4 shadow-md rounded-lg">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    {searchKey && (
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                                className="pl-8 max-w-sm"
                            />
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    {onAddClick && (
                        <Button className="bg-[#23aef2] hover:bg-[#1a8ec0]" onClick={onAddClick}>
                            <Plus className="mr-2 h-4 w-4" />
                            {addButtonText}
                        </Button>
                    )}
                    {onShowFiltersClick && (
                        <Button variant={'outline'} onClick={handleShowFilters}>
                            <Filter className="mr-2 h-4 w-4" />
                            Show Filters
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* Filter Card Section */}
                {showFilters && (
                    <div className="w-1/3 transition-all duration-300">
                        <Card className="bg-white shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-lg font-semibold">Filters</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowFilters(false)}
                                    className="h-6 w-6"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Unit Type Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="unitType">Unit Type</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            if (value === "all") {
                                                table.getColumn("unitType")?.setFilterValue("")
                                            } else {
                                                table.getColumn("unitType")?.setFilterValue(value)
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Patrol Vehicle">Patrol Vehicle</SelectItem>
                                            <SelectItem value="Emergency Response">Emergency Response</SelectItem>
                                            <SelectItem value="Traffic Control">Traffic Control</SelectItem>
                                            <SelectItem value="SWAT Vehicle">SWAT Vehicle</SelectItem>
                                            <SelectItem value="Motorcycle Unit">Motorcycle Unit</SelectItem>
                                            <SelectItem value="K9 Unit">K9 Unit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            if (value === "all") {
                                                table.getColumn("status")?.setFilterValue("")
                                            } else {
                                                table.getColumn("status")?.setFilterValue(value)
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Enabled">Enabled</SelectItem>
                                            <SelectItem value="Disabled">Disabled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Location Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        placeholder="Filter by location"
                                        value={(table.getColumn("location")?.getFilterValue() as string) ?? ""}
                                        onChange={(event) => table.getColumn("location")?.setFilterValue(event.target.value)}
                                    />
                                </div>

                                {/* Vehicle Registration Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleReg">Vehicle Registration</Label>
                                    <Input
                                        placeholder="Filter by vehicle reg"
                                        value={(table.getColumn("vehicleReg")?.getFilterValue() as string) ?? ""}
                                        onChange={(event) => table.getColumn("vehicleReg")?.setFilterValue(event.target.value)}
                                    />
                                </div>

                                {/* Clear All Filters Button */}
                                <div className="pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={clearAllFilters}
                                        className="w-full"
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}
                                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((pageNumber, index) => (
                                <PaginationItem key={index}>
                                    {pageNumber === 'ellipsis' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                                            isActive={currentPage === pageNumber}
                                            className="cursor-pointer"
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => table.nextPage()}
                                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

// Helper function to create a selection column
export function createSelectionColumn<TData>(): ColumnDef<TData> {
    return {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    }
}

// Helper function to create an actions column
export function createActionsColumn<TData>(
    actions: {
        label: string
        onClick: (item: TData) => void
        className?: string
    }[]
): ColumnDef<TData> {
    return {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const item = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {actions.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={action.className}
                            >
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
}