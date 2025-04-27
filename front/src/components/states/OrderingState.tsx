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
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { ChevronLeftCircleIcon, CreditCardIcon } from "lucide-react"
import { toast } from "sonner"

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
	const foodByIdsQuery = useSuspenseQuery(
		trpc.food.getByIds.queryOptions(
			{
				ids: Object.keys(state.context.cart),
			},
			{
				select(data) {
					return data.map((food) => {
						const quantity = state.context.cart[food.id] ?? 0
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
						if (state.context.cart.length === 0) {
							return
						}
						const url = await orderMutation.mutateAsync(
							Object.entries(state.context.cart).map(([foodId, quantity]) => ({
								foodId,
								quantity,
							})),
						)
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
