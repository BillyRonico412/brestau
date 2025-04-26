import { Button } from "@/components/ui/button"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { ChevronLeftCircleIcon, ShoppingCartIcon } from "lucide-react"
import { objectify } from "radash"

export const Footer = () => {
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
					let total = 0
					for (const food of data) {
						const quantity = quantityByFoodId[food.id] ?? 0
						total += food.price * quantity
					}
					return total
				},
			},
		),
	)
	const visibleBackButton =
		state.value !== "welcome" && state.value !== "modeSelection"
	const visibleCartButton =
		state.value !== "welcome" &&
		state.value !== "modeSelection" &&
		state.value !== "confirmation"
	return (
		<div className="space-x-4">
			{visibleBackButton && (
				<Button
					variant="outline"
					onClick={() => {
						send({ type: "BACK" })
					}}
				>
					<ChevronLeftCircleIcon />
					Retour
				</Button>
			)}
			{visibleCartButton && (
				<Button
					onClick={() => {
						send({ type: "GO_TO_CART" })
					}}
				>
					<ShoppingCartIcon />
					Panier ({toCurrency(foodByIdsQuery.data)})
				</Button>
			)}
		</div>
	)
}
