import {
	AdminBody,
	AdminHeader,
	AdminMain,
} from "@/components/admin/AdminMainLayout"
import { SubCategoryCreateDialog } from "@/components/admin/subcategories/SubCategoryCreateDialog"
import { SubCategoryTable } from "@/components/admin/subcategories/SubCategoryTable"
import { Button } from "@/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"
import { PlusCircleIcon } from "lucide-react"

export const Route = createFileRoute("/admin/subcategories/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<AdminMain>
			<AdminHeader className="flex items-center">
				<h2 className="font-semibold text-lg">Sous-catégories</h2>
				<div className="ml-auto">
					<SubCategoryCreateDialog>
						<Button>
							<PlusCircleIcon />
							Ajouter
						</Button>
					</SubCategoryCreateDialog>
				</div>
			</AdminHeader>
			<AdminBody>
				<SubCategoryTable />
			</AdminBody>
		</AdminMain>
	)
}
