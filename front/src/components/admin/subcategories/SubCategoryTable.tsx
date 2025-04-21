import { SubCategoryDeleteDialog } from "@/components/admin/subcategories/SubCategoryDeleteDialog"
import { SubCategoryUpdateDialog } from "@/components/admin/subcategories/SubCategoryUpdateDialog"
import { DataTable } from "@/components/common/DataTable"
import { Button } from "@/components/ui/button"
import { trpc, type Outputs } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ArrowUpDownIcon } from "lucide-react"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type SubCategory = Outputs["subCategory"]["getAll"][number]

const columns: ColumnDef<SubCategory>[] = [
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
		accessorKey: "category.title",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Catégorie
				<ArrowUpDownIcon />
			</Button>
		),
	},
	{
		accessorKey: "image",
		header: () => <div>Image</div>,
		cell: ({ row }) => (
			<img
				src={row.original.image}
				alt={row.original.title}
				className="h-10 w-10 rounded object-cover"
			/>
		),
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
					<SubCategoryUpdateDialog subCategory={row.original} />
					<SubCategoryDeleteDialog subCategoryId={row.original.id} />
				</div>
			)
		},
	},
]

export const SubCategoryTable = () => {
	const getAllQuery = useSuspenseQuery(trpc.subCategory.getAll.queryOptions())

	return <DataTable columns={columns} data={getAllQuery.data} />
}
