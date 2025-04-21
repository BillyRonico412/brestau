import {
	AdminBody,
	AdminHeader,
	AdminMain,
} from "@/components/admin/AdminMainLayout"
import { FoodCreateDialog } from "@/components/admin/foods/FoodCreateDialog"
import { FoodTable } from "@/components/admin/foods/FoodTable"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/foods/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<AdminMain>
			<AdminHeader className="mb-4 flex items-center">
				<h2 className="font-semibold text-lg">Gestion des produits</h2>
				<div className="ml-auto">
					<FoodCreateDialog />
				</div>
			</AdminHeader>
			<AdminBody>
				<FoodTable />
			</AdminBody>
		</AdminMain>
	)
}
