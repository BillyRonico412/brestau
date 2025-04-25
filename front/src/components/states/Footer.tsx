import { Button } from "@/components/ui/button"
import { machineAtom } from "@/lib/machine/machine"
import { useAtom } from "jotai"
import { ChevronLeftCircleIcon, ShoppingCartIcon } from "lucide-react"

export const Footer = () => {
	const [state, send] = useAtom(machineAtom)
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
				<Button>
					Panier
					<ShoppingCartIcon />
				</Button>
			)}
		</div>
	)
}
