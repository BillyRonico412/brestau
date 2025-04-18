import { machineAtom } from "@/lib/machine/machine"
import { states } from "@/lib/machine/states"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"

export const Route = createFileRoute("/")({
	component: IndexComponent,
})

function IndexComponent() {
	const state = useAtomValue(machineAtom)
	return states[state.value].component
}
