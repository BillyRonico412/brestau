import {
	AdminBody,
	AdminHeader,
	AdminMain,
} from "@/components/admin/AdminMainLayout"
import { IngredientCreateDialog } from "@/components/admin/ingredients/IngredientCreateDialog"
import { IngredientTable } from "@/components/admin/ingredients/IngredientTable"
import { Button } from "@/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"
import { PlusCircleIcon } from "lucide-react"

export const Route = createFileRoute("/admin/ingredients/")({
	component: RouteComponent,
})

function RouteComponent() {
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
			<AdminBody>
				<IngredientTable />
			</AdminBody>
		</AdminMain>
	)
}
