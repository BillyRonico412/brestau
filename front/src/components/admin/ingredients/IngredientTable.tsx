import { IngredientDeleteDialog } from "@/components/admin/ingredients/IngredientDeleteDialog"
import { IngredientUpdateDialog } from "@/components/admin/ingredients/IngredientUpdateDialog"
import { DataTable } from "@/components/common/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { trpc, type Outputs } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDownIcon } from "lucide-react"

type Ingredient = Outputs["ingredient"]["getAll"][number]

const columns: ColumnDef<Ingredient>[] = [
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
		accessorKey: "vegetarian",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Végétarien
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => (
			<div>
				{row.original.vegetarian ? (
					<Badge variant="outline" className="bg-green-500 text-white">
						Oui
					</Badge>
				) : (
					<Badge variant="outline" className="bg-red-500 text-white">
						Non
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: "halal",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Halal
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => (
			<div>
				{row.original.halal ? (
					<Badge variant="outline" className="bg-green-500 text-white">
						Oui
					</Badge>
				) : (
					<Badge variant="outline" className="bg-red-500 text-white">
						Non
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: "noGluten",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Sans gluten
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => (
			<div>
				{row.original.noGluten ? (
					<Badge variant="outline" className="bg-green-500 text-white">
						Oui
					</Badge>
				) : (
					<Badge variant="outline" className="bg-red-500 text-white">
						Non
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: "noLactose",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Sans lactose
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => (
			<div>
				{row.original.noLactose ? (
					<Badge variant="outline" className="bg-green-500 text-white">
						Oui
					</Badge>
				) : (
					<Badge variant="outline" className="bg-red-500 text-white">
						Non
					</Badge>
				)}
			</div>
		),
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => (
			<div className="flex justify-end gap-2">
				<IngredientUpdateDialog ingredient={row.original} />
				<IngredientDeleteDialog ingredientId={row.original.id} />
			</div>
		),
	},
]

export const IngredientTable = () => {
	const getAllQuery = useSuspenseQuery(trpc.ingredient.getAll.queryOptions())

	return <DataTable columns={columns} data={getAllQuery.data} />
}
