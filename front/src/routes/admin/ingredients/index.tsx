import {
	AdminBody,
	AdminHeader,
	AdminMain,
} from "@/components/admin/AdminMainLayout"
import { IngredientCreateDialog } from "@/components/admin/ingredients/IngredientCreateDialog"
import { IngredientTable } from "@/components/admin/ingredients/IngredientTable"
import { ingredientTableAtom } from "@/components/admin/ingredients/ingredientTableAtom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { PlusCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/admin/ingredients/")({
	component: RouteComponent,
})

function RouteComponent() {
	const ingredientTable = useAtomValue(ingredientTableAtom)
	const [inputValue, setInputValue] = useState("")
	useEffect(() => {
		ingredientTable?.getColumn("title")?.setFilterValue(inputValue)
	}, [ingredientTable, inputValue])
	return (
		<AdminMain>
			<AdminHeader className="mb-4 flex items-center">
				<h2 className="font-semibold text-lg">Gestion des Ingrédients</h2>
				<div className="ml-auto">
					<IngredientCreateDialog>
						<Button>
							<PlusCircleIcon />
							Ajouter
						</Button>
					</IngredientCreateDialog>
				</div>
			</AdminHeader>
			<AdminBody className="flex flex-col gap-4">
				{ingredientTable && (
					<Input
						placeholder="Rechercher..."
						value={inputValue}
						onChange={(event) => setInputValue(event.target.value)}
						className="max-w-sm"
					/>
				)}
				<IngredientTable />
			</AdminBody>
		</AdminMain>
	)
}
