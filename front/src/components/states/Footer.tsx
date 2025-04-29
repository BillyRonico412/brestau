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
				ids: state.context.order.map((item) => item.foodId),
			},
			{
				select(data) {
					let total = 0
					for (const orderItem of state.context.order) {
						const food = data.find((food) => food.id === orderItem.foodId)
						if (!food) {
							throw new Error("Food not found")
						}
						total += food.price * orderItem.quantity
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
						send({ type: "GO_TO_ORDER" })
					}}
				>
					<ShoppingCartIcon />
					Panier ({toCurrency(foodByIdsQuery.data)})
				</Button>
			)}
		</div>
	)
}
