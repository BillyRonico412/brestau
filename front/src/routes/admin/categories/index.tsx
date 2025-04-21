import {
	AdminBody,
	AdminHeader,
	AdminMain,
} from "@/components/admin/AdminMainLayout"
import { CategoryCreateDialog } from "@/components/admin/categories/CategoryCreateDialog"
import { CategoryTable } from "@/components/admin/categories/CategoryTable"
import { Button } from "@/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"
import { PlusCircleIcon } from "lucide-react"

export const Route = createFileRoute("/admin/categories/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<AdminMain>
			<AdminHeader className="flex items-center">
				<h2 className="font-semibold text-lg">Catégories</h2>
				<div className="ml-auto">
					<CategoryCreateDialog>
						<Button>
							<PlusCircleIcon />
							Ajouter
						</Button>
					</CategoryCreateDialog>
				</div>
			</AdminHeader>
			<AdminBody>
				<CategoryTable />
			</AdminBody>
		</AdminMain>
	)
}
