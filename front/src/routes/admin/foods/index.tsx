import {
	AdminBody,
	AdminHeader,
	AdminMain,
} from "@/components/admin/AdminMainLayout"
import { FoodCreateDialog } from "@/components/admin/foods/FoodCreateDialog"
import { FoodTable } from "@/components/admin/foods/FoodTable"
import { foodTableAtom } from "@/components/admin/foods/foodTableAtom"
import { Input } from "@/components/ui/input"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/admin/foods/")({
	component: RouteComponent,
})

function RouteComponent() {
	const foodTable = useAtomValue(foodTableAtom)
	const [inputValue, setInputValue] = useState("")
	useEffect(() => {
		foodTable?.getColumn("title")?.setFilterValue(inputValue)
	}, [foodTable, inputValue])
	return (
		<AdminMain>
			<AdminHeader className="mb-4 flex items-center">
				<h2 className="font-semibold text-lg">Gestion des produits</h2>
				<div className="ml-auto">
					<FoodCreateDialog />
				</div>
			</AdminHeader>
			<AdminBody className="flex flex-col gap-4">
				{foodTable && (
					<Input
						placeholder="Rechercher..."
						value={inputValue}
						onChange={(event) => setInputValue(event.target.value)}
						className="max-w-sm"
					/>
				)}
				<FoodTable />
			</AdminBody>
		</AdminMain>
	)
}
