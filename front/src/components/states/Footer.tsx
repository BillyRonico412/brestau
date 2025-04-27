import { Button } from "@/components/ui/button"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { ChevronLeftCircleIcon, ShoppingCartIcon } from "lucide-react"

export const Footer = () => {
	const [state, send] = useAtom(machineAtom)
	const foodByIdsQuery = useSuspenseQuery(
		trpc.food.getByIds.queryOptions(
			{
				ids: Object.keys(state.context.cart),
			},
			{
				select(data) {
					let total = 0
					for (const [id, quantity] of Object.entries(state.context.cart)) {
						const food = data.find((food) => food.id === id)
						if (!food) {
							continue
						}

						total += food.price * quantity
					}
					return total
				},
			},
		),
	)
	const visibleBackButton =
		!state.matches("welcome") &&
		!state.matches("modeSelection") &&
		!state.matches({
			selection: "categorySelection",
		})
	const visibleCartButton =
		!state.matches("welcome") && !state.matches("modeSelection")
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
