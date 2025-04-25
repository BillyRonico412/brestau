import { Button } from "@/components/ui/button"
import { machineAtom } from "@/lib/machine/machine"
import { useSetAtom } from "jotai"
import { PackageIcon, UtensilsIcon } from "lucide-react"

export const ModeSelectionState = () => {
	const send = useSetAtom(machineAtom)
	return (
		<div className="flex h-dvh w-dvw">
			<div className="mx-auto my-auto flex w-full max-w-7xl flex-col items-center gap-y-4 px-4 py-2">
				<p className="font-display font-semibold text-xl">
					Tu manges ici ou tu files avec ton festin ?
				</p>
				<div className="flex items-center gap-x-4">
					<Button
						className="w-full"
						onClick={() => {
							send({
								type: "SELECT_MODE",
								mode: "ON_SITE",
							})
						}}
					>
						<UtensilsIcon /> Sur place
					</Button>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							send({
								type: "SELECT_MODE",
								mode: "TO_GO",
							})
						}}
					>
						<PackageIcon /> À emporter
					</Button>
				</div>
			</div>
		</div>
	)
}
