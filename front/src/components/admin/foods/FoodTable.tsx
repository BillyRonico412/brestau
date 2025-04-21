import { FoodDeleteDialog } from "@/components/admin/foods/FoodDeleteDialog"
import { FoodUpdateDialog } from "@/components/admin/foods/FoodUpdateDialog"
import { DataTable } from "@/components/common/DataTable"
import { trpc, type Outputs } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ArrowUpDownIcon } from "lucide-react"

import type { ColumnDef } from "@tanstack/react-table"

type Food = Outputs["food"]["getAll"][number]

const columns: ColumnDef<Food>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Titre
				<ArrowUpDownIcon />
			</Button>
		),
	},
	{
		accessorKey: "subCategory.title",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Sous-catégorie
				<ArrowUpDownIcon />
			</Button>
		),
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Prix
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => <div>{row.original.price.toFixed(2)} €</div>,
	},
	{
		accessorKey: "image",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Image
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => (
			<img
				src={row.original.image}
				alt={row.original.title}
				className="h-10 w-10 rounded object-cover"
			/>
		),
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-end gap-2">
					<FoodUpdateDialog food={row.original} />
					<FoodDeleteDialog foodId={row.original.id} />
				</div>
			)
		},
	},
]

export const FoodTable = () => {
	const getAllQuery = useSuspenseQuery(trpc.food.getAll.queryOptions())
	return <DataTable columns={columns} data={getAllQuery.data} />
}
