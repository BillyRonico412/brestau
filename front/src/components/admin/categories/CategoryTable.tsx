import { CategoryDeleteDialog } from "@/components/admin/categories/CategoryDeleteDialog"
import { CategoryUpdateDialog } from "@/components/admin/categories/CategoryUpdateDialog"
import { DataTable } from "@/components/common/DataTable"
import { trpc, type Outputs } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ArrowUpDownIcon } from "lucide-react"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Category = Outputs["category"]["getAll"][number]

const colums: ColumnDef<Category>[] = [
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
		accessorKey: "subCategoriesCount",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Sous-catégories
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => <Badge>{row.original.subCategoriesCount}</Badge>,
	},
	{
		accessorKey: "foodsCount",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Produits
				<ArrowUpDownIcon />
			</Button>
		),
		cell: ({ row }) => <Badge>{row.original.foodsCount}</Badge>,
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-end gap-2">
					<CategoryUpdateDialog category={row.original} />
					<CategoryDeleteDialog categoryId={row.original.id} />
				</div>
			)
		},
	},
]

export const CategoryTable = () => {
	const getAllQuery = useSuspenseQuery(trpc.category.getAll.queryOptions())

	return <DataTable columns={colums} data={getAllQuery.data} />
}
