import {
	SelectionBody,
	SelectionEmptyState,
	SelectionHeader,
	SelectionLayout,
} from "@/components/states/SelectionLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type Context, machineAtom } from "@/lib/machine/machine"
import { type Outputs, trpc } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useAtom, useSetAtom } from "jotai"
import {
	ChevronLeftCircleIcon,
	CreditCardIcon,
	MinusCircleIcon,
	Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

const FoodCard = (props: {
	orderItem: Context["order"][number]
	food: Outputs["food"]["getByIds"][number]
	total: number
	index: number
}) => {
	const send = useSetAtom(machineAtom)
	return (
		<Card className="h-full w-64 cursor-pointer bg-muted p-0">
			<CardContent>
				<img
					src={props.food.image}
					alt={props.food.title}
					className="aspect-square w-full rounded-lg object-contain"
				/>
			</CardContent>
			<CardFooter className="flex flex-col gap-3 pb-4">
				<p className="font-medium">{props.food.title}</p>
				<p className="text-sm">
					{props.orderItem.quantity} x {toCurrency(props.food.price)}
				</p>
				<div className="flex w-full flex-wrap items-center gap-2">
					{props.orderItem.removedIngredientIds.map((ingredientId) => {
						const ingredient = props.food.ingredients.find(
							(ingredient) => ingredient.id === ingredientId,
						)
						if (!ingredient) {
							throw new Error("Ingredient not found")
						}
						return (
							<Badge
								variant="outline"
								className="flex items-center gap-1"
								key={ingredient.id}
							>
								<MinusCircleIcon size={12} />
								{ingredient.title}
							</Badge>
						)
					})}
				</div>
				<Separator />
				<Button
					size="sm"
					variant="destructive"
					onClick={() => {
						send({
							type: "REMOVE_FROM_ORDER",
							index: props.index,
						})
					}}
				>
					<Trash2Icon size={14} />
					Supprimer
				</Button>
			</CardFooter>
		</Card>
	)
}

export const OrderingState = () => {
	const [state, send] = useAtom(machineAtom)
	const foodByIdsQuery = useSuspenseQuery(
		trpc.food.getByIds.queryOptions(
			{
				ids: state.context.order.map((item) => item.foodId),
			},
			{
				select(data) {
					return data.map((food) => {
						const orderItem = state.context.order.find(
							(item) => item.foodId === food.id,
						)
						if (!orderItem) {
							throw new Error("Order item not found")
						}
						return {
							food,
							quantity: orderItem.quantity,
							total: food.price * orderItem.quantity,
						}
					})
				},
			},
		),
	)
	const orderMutation = useMutation(
		trpc.order.createOrder.mutationOptions({
			onSuccess() {
				toast.success("Vous allez être redirigé vers la page de paiement")
			},
			onError() {
				toast.error(
					"Une erreur est survenue lors de la création de la commande",
				)
			},
		}),
	)
	return (
		<SelectionLayout>
			<SelectionHeader>Récapitulatif de la commande</SelectionHeader>
			<SelectionBody>
				<div className="flex flex-wrap items-stretch justify-center gap-8">
					{state.context.order.map((orderItem, index) => {
						const data = foodByIdsQuery.data.find(
							(it) => it.food.id === orderItem.foodId,
						)
						if (!data) {
							throw new Error("Food not found")
						}
						return (
							<div key={index}>
								<FoodCard
									index={index}
									food={data.food}
									orderItem={orderItem}
									total={data.total}
								/>
							</div>
						)
					})}
				</div>
				{state.context.order.length === 0 && (
					<SelectionEmptyState
						title="Aucun produit dans le panier"
						description="Ajoutez des produits à votre panier pour passer une commande."
					/>
				)}
			</SelectionBody>
			<div className="flex items-center justify-center gap-4">
				<Button
					variant="outline"
					onClick={() => {
						send({ type: "BACK" })
					}}
				>
					<ChevronLeftCircleIcon />
					Retour
				</Button>
				<Button
					size="lg"
					onClick={async () => {
						if (state.context.order.length === 0) {
							return
						}
						const url = await orderMutation.mutateAsync(state.context.order)
						if (!url) {
							return
						}
						window.location.href = url
					}}
				>
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
