import { states } from "@/lib/machine/states"
import { atomWithMachine } from "jotai-xstate"
import { assign, setup } from "xstate"

export type Mode = "ON_SITE" | "TO_GO"

interface Context {
	mode: Mode | undefined
}

type Event =
	| {
			type: "START_ORDER"
	  }
	| {
			type: "SELECT_MODE"
			mode: Mode
	  }

const machine = setup({
	types: {
		context: {} as Context,
		events: {} as Event,
	},
	actions: {},
	guards: {},
}).createMachine({
	initial: states.welcome.value,
	context: {
		mode: undefined,
	},
	states: {
		[states.welcome.value]: {
			on: {
				START_ORDER: states.modeSelection.value,
			},
		},
		[states.modeSelection.value]: {
			on: {
				SELECT_MODE: {
					target: states.categorySelection.value,
					actions: assign({
						mode: ({ event }) => event.mode,
					}),
				},
			},
		},
		[states.categorySelection.value]: {}, // Choix entre burgers, boissons, etc.
		[states.itemCustomization.value]: {}, // Customisation (ex: sans oignon)
		[states.cartReview.value]: {}, // Panier avec résumé
		[states.payment.value]: {}, // Paiement (mock ou réel)
		[states.confirmation.value]: {}, // Confirmation de commande
		[states.cancelled.value]: {},
	},
})

export const machineAtom = atomWithMachine(machine)
