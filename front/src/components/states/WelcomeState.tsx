import { machineAtom } from "@/lib/machine/machine"
import { useSetAtom } from "jotai"

export const WelcomeState = () => {
	const send = useSetAtom(machineAtom)
	return (
		<div
			className="flex h-dvh w-dvw"
			onClick={() =>
				send({
					type: "START_ORDER",
				})
			}
		>
			<div className="mx-auto my-auto flex flex-col items-center justify-center gap-y-4">
				<h1 className="font-bold font-display text-4xl">🍔 BRestau 🍸</h1>
				<p className="font-medium">
					Cliquer n'importe où pour commencer à commander !
				</p>
			</div>
		</div>
	)
}
