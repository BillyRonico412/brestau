import {
	SelectionBody,
	SelectionEmptyState,
	SelectionHeader,
	SelectionLayout,
} from "@/components/states/SelectionLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { machineAtom } from "@/lib/machine/machine"
import { type Outputs, trpc } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { CreditCard, CreditCardIcon } from "lucide-react"
import { objectify } from "radash"

const FoodCard = (props: {
	food: Outputs["food"]["getByIds"][number]
	quantity: number
	total: number
}) => {
	return (
		<Card className="h-full w-64 cursor-pointer bg-muted p-0 transition-colors hover:bg-accent">
			<CardContent>
				<img
					src={props.food.image}
					alt={props.food.title}
					className="aspect-square w-full rounded-lg object-contain"
				/>
			</CardContent>
			<CardFooter className="flex flex-col pb-4">
				<p className="font-medium">{props.food.title}</p>
				<p className="text-sm">
					{props.quantity} x {toCurrency(props.food.price)}
				</p>
			</CardFooter>
		</Card>
	)
}

export const OrderingState = () => {
	const [state, send] = useAtom(machineAtom)
	const quantityByFoodId = objectify(
		state.context.cart,
		(food) => food.foodId,
		(food) => food.quantity,
	)
	const foodByIdsQuery = useSuspenseQuery(
		trpc.food.getByIds.queryOptions(
			{
				ids: state.context.cart.map((food) => food.foodId),
			},
			{
				select(data) {
					return data.map((food) => {
						const quantity = quantityByFoodId[food.id] ?? 0
						return {
							food,
							quantity,
							total: food.price * quantity,
						}
					})
				},
			},
		),
	)
	return (
		<SelectionLayout>
			<SelectionHeader>Récapitulatif de la commande</SelectionHeader>
			<SelectionBody>
				<div className="flex flex-wrap items-stretch justify-center gap-8">
					{foodByIdsQuery.data.map((data) => (
						<div key={data.food.id} className="">
							<FoodCard
								key={data.food.id}
								food={data.food}
								quantity={data.quantity}
								total={data.total}
							/>
						</div>
					))}
				</div>
				{state.context.cart.length === 0 && (
					<SelectionEmptyState
						title="Aucun produit dans le panier"
						description="Ajoutez des produits à votre panier pour passer une commande."
					/>
				)}
			</SelectionBody>
			<div>
				<Button size="lg">
					<CreditCardIcon />
					Payer (
					{toCurrency(
						foodByIdsQuery.data.reduce((acc, data) => acc + data.total, 0),
					)}
					)
				</Button>
			</div>
		</SelectionLayout>
	)
}
