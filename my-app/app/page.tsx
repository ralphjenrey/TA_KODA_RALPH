"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createActionsColumn, createSelectionColumn, DataTable } from "./components/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Unit } from "./models/unit";
import { API_ENDPOINTS } from "./api_endpoints";

const columns: ColumnDef<Unit>[] = [
  createSelectionColumn<Unit>(),
  {
    accessorKey: "id",
    header: "Unit ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "unitName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Unit Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("unitName")}</div>,
  },
  {
    accessorKey: "unitType",
    header: "Unit Type",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("unitType")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "vehicleReg",
    header: "Vehicle Reg",
    cell: ({ row }) => <div>{row.getValue("vehicleReg")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === "Enabled" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  createActionsColumn<Unit>([
    {
      label: "Copy unit ID",
      onClick: (unit) => navigator.clipboard.writeText(unit.id),
    },
    {
      label: "View unit details",
      onClick: (unit) => console.log("View", unit),
    },
    {
      label: "Edit unit",
      onClick: (unit) => console.log("Edit", unit),
    },
    {
      label: "Delete unit",
      onClick: (unit) => console.log("Delete", unit),
      className: "text-red-600",
    },
  ]),
]

export default function Home() {
  const [data, setData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.UNITS.GET_ALL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const units = await response.json();
        setData(units);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch units');
        console.error('Error fetching units:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading units...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start mb-5"> 
        <DataTable 
          columns={columns} 
          data={data}
          searchKey="unitName"
          searchPlaceholder="Search units..."
          addButtonText="Add Unit"
          onShowFiltersClick={() => console.log("Show filters")}
          onAddClick={() => console.log("Add new unit")}
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        All rights reserved © 2025
      </footer>
    </div>
  );
}