import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon } from "lucide-react"

export const ButtonNumber = (props: {
	nb: number
	setNb: (nb: number) => void
}) => {
	return (
		<div className="flex items-center justify-end gap-2">
			<Button
				variant="outline"
				size="icon"
				onClick={() => props.setNb(props.nb - 1)}
				disabled={props.nb <= 1}
			>
				<MinusIcon />
			</Button>
			<p className="font-semibold">{props.nb}</p>
			<Button
				variant="outline"
				size="icon"
				onClick={() => props.setNb(props.nb + 1)}
			>
				<PlusIcon />
			</Button>
		</div>
	)
}
