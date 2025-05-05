import { Footer } from "@/components/states/Footer"
import {
	SelectionBody,
	SelectionEmptyState,
	SelectionHeader,
	SelectionLayout,
} from "@/components/states/SelectionLayout"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { machineAtom } from "@/lib/machine/machine"
import { trpc, type Outputs } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"

const SubCategoryCard = (
	props: Outputs["category"]["getAllForClient"][number]["subCategories"][number],
) => {
	const send = useSetAtom(machineAtom)
	return (
		<Card
			className="w-64 cursor-pointer bg-muted p-0 transition-colors hover:bg-accent"
			onClick={() => {
				send({
					type: "SELECT_SUB_CATEGORY",
					subCategoryId: props.id,
				})
			}}
		>
			<CardContent>
				<img
					src={props.image}
					alt={props.title}
					className="aspect-square w-full rounded-lg object-contain"
				/>
			</CardContent>
			<CardFooter className="flex justify-center pb-4">
				<p className="font-medium">{props.title}</p>
			</CardFooter>
		</Card>
	)
}

export const SubCategorySelectionState = () => {
	const state = useAtomValue(machineAtom)
	const subCategoriesQuery = useSuspenseQuery(
		trpc.category.getAllForClient.queryOptions(undefined, {
			select(data) {
				if (!state.context.currentCategoryId) {
					throw new Error("No category selected")
				}
				const category = data.find((category) => {
					return category.id === state.context.currentCategoryId
				})
				if (!category) {
					throw new Error("Category not found")
				}
				return category
			},
		}),
	)
	return (
		<SelectionLayout>
			<SelectionHeader>{subCategoriesQuery.data.title}</SelectionHeader>
			<SelectionBody>
				<div className="flex flex-wrap items-center justify-center gap-8">
					{subCategoriesQuery.data.subCategories.map((subCategory) => (
						<div key={subCategory.id}>
							<SubCategoryCard key={subCategory.id} {...subCategory} />
						</div>
					))}
				</div>
				{subCategoriesQuery.data.subCategories.length === 0 && (
					<SelectionEmptyState
						title="Aucune sous-catégorie disponible"
						description="Revenez plus tard, il n'y a pas de sous-catégorie disponible pour cette catégorie."
					/>
				)}
			</SelectionBody>
			<Separator />
			<Footer />
		</SelectionLayout>
	)
}
