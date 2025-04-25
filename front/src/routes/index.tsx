import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary"
import { QuerySuspense } from "@/components/common/QuerySuspense"
import { CategorySelectionState } from "@/components/states/CategorySelectionState"
import { ConfirmationState } from "@/components/states/ConfirmationState"
import { FoodSelectionState } from "@/components/states/FoodSelectionState"
import { FoodSummaryState } from "@/components/states/FoodSummaryState"
import { ModeSelectionState } from "@/components/states/ModeSelectionState"
import { PaymentState } from "@/components/states/PaymentState"
import { SubCategorySelectionState } from "@/components/states/SubCategorySelectionState"
import { WelcomeState } from "@/components/states/WelcomeState"
import { machineAtom } from "@/lib/machine/machine"
import type { State } from "@/lib/machine/states"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import type { ReactNode } from "react"

const stateComponents: Record<State, ReactNode> = {
	welcome: <WelcomeState />,
	modeSelection: <ModeSelectionState />,
	categorySelection: <CategorySelectionState />,
	subCategorySelection: <SubCategorySelectionState />,
	foodSelection: <FoodSelectionState />,
	foodSummary: <FoodSummaryState />,
	order: <div>OrderState</div>,
	payment: <PaymentState />,
	confirmation: <ConfirmationState />,
}

export const Route = createFileRoute("/")({
	component: IndexComponent,
})

function IndexComponent() {
	const state = useAtomValue(machineAtom)
	return (
		<div className="h-dvh w-dvw overflow-hidden">
			<QueryErrorBoundary>
				<QuerySuspense>{stateComponents[state.value]}</QuerySuspense>
			</QueryErrorBoundary>
		</div>
	)
}
