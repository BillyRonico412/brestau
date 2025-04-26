import { ButtonNumber } from "@/components/common/ButtonNumber"
import { Footer } from "@/components/states/Footer"
import {
	SelectionBody,
	SelectionHeader,
	SelectionLayout,
} from "@/components/states/SelectionLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { ShoppingBasketIcon } from "lucide-react"
import { useState } from "react"

export const FoodSummaryState = () => {
	const [state, send] = useAtom(machineAtom)
	const foodQuery = useSuspenseQuery(
		trpc.food.getById.queryOptions({
			id: state.context.currentFoodId,
		}),
	)
	const [nb, setNb] = useState(1)
	return (
		<SelectionLayout>
			<SelectionHeader>{foodQuery.data.title}</SelectionHeader>
			<SelectionBody>
				<div className="flex flex-col gap-y-8">
					<div className="flex flex-col items-center gap-8 sm:flex-row">
						<div>
							<img
								src={foodQuery.data.image}
								alt={foodQuery.data.title}
								className="aspect-square w-64 rounded-lg object-contain"
							/>
						</div>
						<div className="flex flex-1 flex-col gap-y-4">
							<p>{foodQuery.data.description}</p>
							<div className="flex items-center gap-x-8">
								<p className="font-medium text-sm">Ingrédients</p>
								<div className="flex flex-1 flex-wrap items-center gap-4">
									{foodQuery.data.ingredients.map((ingredient) => (
										<Badge variant="outline" key={ingredient.id}>
											{ingredient.title}
										</Badge>
									))}
								</div>
							</div>
							<div className="flex items-center gap-x-8">
								<p className="font-medium text-sm">Particularités</p>
								<div className="flex flex-1 flex-wrap items-center gap-4">
									{foodQuery.data.ingredients.every(
										(ingredient) => ingredient.halal,
									) && (
										<Badge variant="outline" key="halal">
											Halal
										</Badge>
									)}
									{foodQuery.data.ingredients.every(
										(ingredient) => ingredient.vegetarian,
									) && (
										<Badge variant="outline" key="vegetarian">
											Végétarien
										</Badge>
									)}
									{foodQuery.data.ingredients.every(
										(ingredient) => ingredient.noGluten,
									) && (
										<Badge variant="outline" key="noGluten">
											Sans gluten
										</Badge>
									)}
									{foodQuery.data.ingredients.every(
										(ingredient) => ingredient.noLactose,
									) && (
										<Badge variant="outline" key="noLactose">
											Sans lactose
										</Badge>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</SelectionBody>
			<Separator />
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="flex items-center justify-center gap-6">
					<p className="font-semibold text-lg">
						{toCurrency(foodQuery.data.price * nb)}
					</p>
					<ButtonNumber nb={nb} setNb={setNb} />
					<Button
						onClick={() => {
							send({
								type: "ADD_TO_CART",
								quantity: nb,
							})
						}}
					>
						<ShoppingBasketIcon />
						Ajouter
					</Button>
				</div>
				<Footer />
			</div>
		</SelectionLayout>
	)
}
