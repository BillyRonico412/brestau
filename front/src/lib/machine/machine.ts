import { states } from "@/lib/machine/states"
import { atomWithMachine } from "jotai-xstate"
import { assign, setup } from "xstate"

export type Mode = "ON_SITE" | "TO_GO"

interface Context {
	mode: Mode | undefined
	currentCategoryId: string | undefined
	currentSubCategoryId: string | undefined
	currentFoodId: string | undefined
}

type Event =
	| {
			type: "BACK"
	  }
	| {
			type: "START_ORDER"
	  }
	| {
			type: "SELECT_MODE"
			mode: Mode
	  }
	| {
			type: "SELECT_CATEGORY"
			categoryId: string
	  }
	| {
			type: "SELECT_SUB_CATEGORY"
			subCategoryId: string
	  }
	| {
			type: "SELECT_FOOD"
			foodId: string
	  }

const machine = setup({
	types: {
		context: {} as Context,
		events: {} as Event,
	},
	actions: {},
	guards: {},
}).createMachine({
	initial: states.categorySelection,
	context: {
		mode: undefined,
		currentCategoryId: undefined,
		currentSubCategoryId: undefined,
		currentFoodId: undefined,
	},
	states: {
		[states.welcome]: {
			on: {
				START_ORDER: states.modeSelection,
			},
		},
		[states.modeSelection]: {
			on: {
				SELECT_MODE: {
					target: states.categorySelection,
					actions: assign({
						mode: ({ event }) => event.mode,
					}),
				},
			},
		},
		[states.categorySelection]: {
			on: {
				SELECT_CATEGORY: {
					target: states.subCategorySelection,
					actions: assign({
						currentCategoryId: ({ event }) => event.categoryId,
					}),
				},
				BACK: {
					target: states.welcome,
					actions: assign({
						mode: undefined,
						currentCategoryId: undefined,
						currentSubCategoryId: undefined,
						currentFoodId: undefined,
					}),
				},
			},
		},
		[states.subCategorySelection]: {
			on: {
				SELECT_SUB_CATEGORY: {
					target: states.foodSelection,
					actions: assign({
						currentSubCategoryId: ({ event }) => event.subCategoryId,
					}),
				},
				BACK: {
					target: states.categorySelection,
					actions: assign({
						currentSubCategoryId: undefined,
					}),
				},
			},
		},
		[states.foodSelection]: {
			on: {
				SELECT_FOOD: {
					target: states.foodSummary,
					actions: assign({
						currentFoodId: ({ event }) => event.foodId,
					}),
				},
				BACK: {
					target: states.subCategorySelection,
					actions: assign({
						currentFoodId: undefined,
					}),
				},
			},
		},
		[states.foodSummary]: {
			on: {
				BACK: {
					target: states.foodSelection,
					actions: assign({
						currentFoodId: undefined,
					}),
				},
				START_ORDER: states.order,
			},
		}, // Détails du plat et customisation
		[states.order]: {}, // Résumé de la commande
		[states.payment]: {}, // Paiement (mock ou réel)
		[states.confirmation]: {}, // Confirmation de commande
	},
})

export const machineAtom = atomWithMachine(machine)
