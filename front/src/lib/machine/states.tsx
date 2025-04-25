export const states = {
	welcome: "welcome",
	modeSelection: "modeSelection",
	categorySelection: "categorySelection",
	subCategorySelection: "subCategorySelection",
	foodSelection: "foodSelection",
	foodSummary: "foodSummary",
	order: "order",
	payment: "payment",
	confirmation: "confirmation",
} as const

export type State = keyof typeof states
