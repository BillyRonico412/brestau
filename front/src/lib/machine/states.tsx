import { CancelledState } from "@/components/states/CancelledState"
import { CartReviewState } from "@/components/states/CartReviewState"
import { CategorySelectionState } from "@/components/states/CategorySelectionState"
import { ConfirmationState } from "@/components/states/ConfirmationState"
import { ItemCustomizationState } from "@/components/states/ItemCustomizationState"
import { ModeSelectionState } from "@/components/states/ModeSelectionState"
import { PaymentState } from "@/components/states/PaymentState"
import { WelcomeState } from "@/components/states/WelcomeState"

export const states = {
	welcome: {
		value: "welcome",
		component: <WelcomeState />,
	},
	modeSelection: {
		value: "modeSelection",
		component: <ModeSelectionState />,
	},
	categorySelection: {
		value: "categorySelection",
		component: <CategorySelectionState />,
	},
	itemCustomization: {
		value: "itemCustomization",
		component: <ItemCustomizationState />,
	},
	cartReview: {
		value: "cartReview",
		component: <CartReviewState />,
	},
	payment: {
		value: "payment",
		component: <PaymentState />,
	},
	confirmation: {
		value: "confirmation",
		component: <ConfirmationState />,
	},
	cancelled: {
		value: "cancelled",
		component: <CancelledState />,
	},
} as const
