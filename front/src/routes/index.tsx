import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary"
import { QuerySuspense } from "@/components/common/QuerySuspense"
import { CategorySelectionState } from "@/components/states/CategorySelectionState"
import { FoodSelectionState } from "@/components/states/FoodSelectionState"
import { FoodSummaryState } from "@/components/states/FoodSummaryState"
import { ModeSelectionState } from "@/components/states/ModeSelectionState"
import { OrderingState } from "@/components/states/OrderingState"
import { SubCategorySelectionState } from "@/components/states/SubCategorySelectionState"
import { WelcomeState } from "@/components/states/WelcomeState"
import { machineAtom } from "@/lib/machine/machine"
import { createFileRoute } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { match } from "ts-pattern"

export const Route = createFileRoute("/")({
	component: IndexComponent,
})

function IndexComponent() {
	const state = useAtomValue(machineAtom)
	return (
		<div className="h-dvh w-dvw overflow-hidden font-display">
			<QueryErrorBoundary>
				<QuerySuspense>
					{match(state)
						.with({ value: "welcome" }, () => <WelcomeState />)
						.with({ value: "modeSelection" }, () => <ModeSelectionState />)
						.with({ value: { selection: "categorySelection" } }, () => (
							<CategorySelectionState />
						))
						.with({ value: { selection: "subCategorySelection" } }, () => (
							<SubCategorySelectionState />
						))
						.with({ value: { selection: "foodSelection" } }, () => (
							<FoodSelectionState />
						))
						.with({ value: { selection: "foodSummary" } }, () => (
							<FoodSummaryState />
						))
						.with({ value: "ordering" }, () => <OrderingState />)
						.exhaustive()}
				</QuerySuspense>
			</QueryErrorBoundary>
		</div>
	)
}
