import { Footer } from "@/components/states/Footer"
import {
	SelectionBody,
	SelectionEmptyState,
	SelectionHeader,
	SelectionLayout,
} from "@/components/states/SelectionLayout"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useSetAtom } from "jotai"

export const CategorySelectionState = () => {
	const categoriesQuery = useSuspenseQuery(trpc.category.getAll.queryOptions())
	const send = useSetAtom(machineAtom)
	return (
		<SelectionLayout>
			<SelectionHeader>Choisis une catégorie</SelectionHeader>
			<SelectionBody>
				<div className="flex flex-wrap items-center gap-4">
					{categoriesQuery.data.map((category) => (
						<Button
							key={category.id}
							onClick={() => {
								send({
									type: "SELECT_CATEGORY",
									categoryId: category.id,
								})
							}}
						>
							{category.title}
						</Button>
					))}
					{categoriesQuery.data.length === 0 && (
						<SelectionEmptyState
							title="Aucune catégorie disponible"
							description="Aucune catégorie disponible pour cette catégorie."
						/>
					)}
				</div>
			</SelectionBody>
			<Separator />
			<Footer />
		</SelectionLayout>
	)
}
