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
import { type Outputs, trpc } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { CheckIcon, ShoppingBasketIcon, XIcon } from "lucide-react"

const Ingredient = (props: {
	ingredient: Outputs["food"]["getById"]["ingredients"][number]
}) => {
	const [state, send] = useAtom(machineAtom)
	if (!state.context.currentOrderItem) {
		return null
	}
	const isRemoved = state.context.currentOrderItem.removedIngredientIds.some(
		(ingredientId) => ingredientId === props.ingredient.id,
	)
	const onClick = () => {
		if (!state.context.currentOrderItem) {
			throw new Error("No current order item")
		}
		let removedIngredientIds = [
			...state.context.currentOrderItem.removedIngredientIds,
		]
		if (!isRemoved) {
			removedIngredientIds.push(props.ingredient.id)
		} else {
			removedIngredientIds = removedIngredientIds.filter(
				(ingredientId) => ingredientId !== props.ingredient.id,
			)
		}
		send({
			type: "UPDATE_CURRENT_ORDER_ITEM",
			removedIngredientIds,
		})
	}
	return (
		<Badge
			variant={isRemoved ? "outline" : "default"}
			className="relative"
			key={props.ingredient.id}
		>
			{props.ingredient.title}
			<Button
				className="-translate-y-1/2 absolute top-0 right-0 flex h-4 w-4 translate-x-1/2 items-center justify-center rounded-full p-0"
				variant={!isRemoved ? "destructive" : "default"}
				onClick={(e) => {
					e.stopPropagation()
					onClick()
				}}
			>
				{isRemoved ? (
					<CheckIcon className="!size-3" />
				) : (
					<XIcon className="!size-3" />
				)}
			</Button>
		</Badge>
	)
}

export const FoodSummaryState = () => {
	const [state, send] = useAtom(machineAtom)
	const foodQuery = useSuspenseQuery(
		trpc.category.getAllForClient.queryOptions(undefined, {
			select(data) {
				const currentOrderItem = state.context.currentOrderItem
				if (!currentOrderItem) {
					throw new Error("No current order item")
				}
				const food = data
					.flatMap((category) => category.subCategories)
					.flatMap((subCategory) => subCategory.foods)
					.find((food) => food.id === currentOrderItem.foodId)
				if (!food) {
					throw new Error("Food not found")
				}
				return food
			},
		}),
	)
	if (!state.context.currentOrderItem) {
		throw new Error("No food selected")
	}
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
							{foodQuery.data.ingredients.length > 0 && (
								<div className="flex items-center gap-x-8">
									<p className="font-medium text-sm">Ingrédients</p>
									<div className="flex flex-1 flex-wrap items-center gap-4">
										{foodQuery.data.ingredients.map((ingredient) => (
											<Ingredient key={ingredient.id} ingredient={ingredient} />
										))}
									</div>
								</div>
							)}
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
						{toCurrency(
							foodQuery.data.price * state.context.currentOrderItem.quantity,
						)}
					</p>
					<ButtonNumber
						nb={state.context.currentOrderItem.quantity}
						setNb={(nb) => {
							send({
								type: "UPDATE_CURRENT_ORDER_ITEM",
								quantity: nb,
							})
						}}
					/>
					<Button
						onClick={() => {
							send({
								type: "ADD_TO_ORDER",
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
