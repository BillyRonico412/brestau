import { atomWithMachine } from "jotai-xstate"
import { assign, setup, type StateFrom } from "xstate"

export type Mode = "ON_SITE" | "TO_GO"

interface Context {
	mode: Mode | undefined
	currentCategoryId: string | undefined
	currentSubCategoryId: string | undefined
	currentFoodId: string | undefined
	cart: {
		foodId: string
		quantity: number
	}[]
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
	| {
			type: "ADD_TO_CART"
			quantity: number
	  }
	| {
			type: "GO_TO_CART"
	  }

const machine = setup({
	types: {
		context: {} as Context,
		events: {} as Event,
	},
	actions: {},
	guards: {},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgHcwAbTAe1TAGIBlAFQEEAlFgfQHkOAIgFEOAbQAMAXUSgADjVi4ALrhr4ZIAB6IAjADYdJAEwAOHUYCsF8ToCcAFgsGAzABoQAT13PbJa+PEjWxMAdh0dcWcrAF9o9zQsPEJSVBoIMCYqMEwVNWYhABkhAGEeAFleYQlpJBB5RVz1Wu0ECyN3LwQ9e2cSWwtnHTaLfosQkyNY+IwcAmISWCyc1XwGAHFebhZN4s4Wao165RWNFv0xvvE9ZwN7PSMjHWcQjsQ9d5I9ENsQ8ScQqyPPRTEAJWbJBZLRokTDoJRgKA0ABOHkylGyjXyRVK3F2LCEGw4AE0DrUjo1TogQiE9CQTCNnCYTO9bJZAq9Wh9HIM9IFQg5HCCwUl5ot0cs1AsAK4AI2KcIRyNRUJWWJKPCYAFUAEK4tj4wkkqSHBTHNSUhDmK4kGlOWzBcJPExuTyIJwmPoDfR8772QVxUEzEWkMUYlbSuUKxEotFhvLatjFADSpLkpopzUQoV6tpCRj0wSMgx0L1dCHsvz8AUitm6+mZfqFQbmIZVkoAZjQ0rGJasmIV1dwAGK8Sqpurpk6Zy2mXqDfMPEz2Wx2K4c+kWS73EziWzOexGQKTAPCluQ8XQzvdturBPJ8fkqegM77wxBAu1iz2Hchewciu9NWNZ1noDb2E2iRnqGvYkFeEBMFKqAYCiDBsAIAhbDsewPpO5rTvYQwkDooQWBEoFjNyf5lhWtLiM6zimN+EwBI2J7NhC0GXl28GIchHgMHeKbGmSuFNM+iAEZuxEAmR9K-gMVGdGERgkAePyHgYEQhPusQBvgaRwBop7JCaDRPloiAALR6BylmbvaDmOU5zgQeC8wUNQdBgKZZpiRZ5btGWOj2OIJBAXYzFLgxFiucGJCpOkPYZmmZl4eJCAMb4ZiWHY3R-A6HLBaF4WFnRPSWLFUE3j5yX+Yem4kYEda2DYzwWByjKAdWRgHnaX4uWxkEcTeJB4LASg1eZLSWCEYXzqBjyOPSLqdF8s1DPcfWhD0OiVcNF7hrC8LRsqB1pROqV+S0FhLjaehOBEBFmDSK0SfaJDOLuDjEQWvwDHtoojbAsrysdSpJeZj7nS0wSblEDgDDYN0Mhy1iGDu9pPb9fzPADrZnfgsHcRD51Q1dugVipJgtXmlhmPcJao7uNo0rypHiNSy7OAN0xDYDBNE92vHoCik3Q4gli9I1+YES1TwAhy2kehtksjOIy4jHjJDIukSIEFAYvk5az10j0TI-BFvyvV0XxEd8f1fIC+ha7Q+DtrgSIYLVZMWge66GP4AQDPuFZ2Lp0RAA */
	initial: "welcome",
	context: {
		mode: undefined,
		currentCategoryId: undefined,
		currentSubCategoryId: undefined,
		currentFoodId: undefined,
		cart: [],
	},
	states: {
		welcome: {
			on: {
				START_ORDER: "modeSelection",
			},
		},
		modeSelection: {
			on: {
				SELECT_MODE: {
					target: "selection",
					actions: assign({
						mode: ({ event }) => event.mode,
					}),
				},
			},
		},
		selection: {
			initial: "categorySelection",
			on: {
				GO_TO_CART: "ordering",
			},
			states: {
				hist: {
					type: "history",
				},
				categorySelection: {
					on: {
						SELECT_CATEGORY: {
							target: "subCategorySelection",
							actions: assign({
								currentCategoryId: ({ event }) => event.categoryId,
							}),
						},
					},
				},
				subCategorySelection: {
					on: {
						SELECT_SUB_CATEGORY: {
							target: "foodSelection",
							actions: assign({
								currentSubCategoryId: ({ event }) => event.subCategoryId,
							}),
						},
						BACK: {
							target: "categorySelection",
							actions: assign({
								currentSubCategoryId: undefined,
							}),
						},
					},
				},
				foodSelection: {
					on: {
						SELECT_FOOD: {
							target: "foodSummary",
							actions: assign({
								currentFoodId: ({ event }) => event.foodId,
							}),
						},
						BACK: {
							target: "subCategorySelection",
							actions: assign({
								currentFoodId: undefined,
							}),
						},
					},
				},
				foodSummary: {
					on: {
						ADD_TO_CART: {
							target: "categorySelection",
							actions: assign({
								cart: ({ event, context }) => {
									if (!context.currentFoodId) {
										throw new Error("No food selected")
									}
									return [
										...context.cart,
										{ foodId: context.currentFoodId, quantity: event.quantity },
									]
								},
							}),
						},
						BACK: {
							target: "foodSelection",
							actions: assign({
								currentFoodId: undefined,
							}),
						},
					},
				},
			},
		},
		ordering: {},
		confirmation: {},
	},
})
export type States = StateFrom<typeof machine>["value"]

export const machineAtom = atomWithMachine(machine)
