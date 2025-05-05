import { Footer } from "@/components/states/Footer"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"

import {
	SelectionBody,
	SelectionEmptyState,
	SelectionHeader,
	SelectionLayout,
} from "@/components/states/SelectionLayout"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Outputs } from "@/lib/trpc"
import { toCurrency } from "@/lib/utils"

const FoodCard = (
	props: Outputs["food"]["getBySubCategoryId"]["foods"][number],
) => {
	const send = useSetAtom(machineAtom)
	return (
		<Card
			className="w-64 cursor-pointer bg-muted p-0 transition-colors hover:bg-accent"
			onClick={() => {
				send({
					type: "SELECT_FOOD",
					foodId: props.id,
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
			<CardFooter className="flex flex-col pb-4">
				<p className="font-medium">{props.title}</p>
				<p className="text-muted-foreground text-sm">
					{toCurrency(props.price)}
				</p>
			</CardFooter>
		</Card>
	)
}

export const FoodSelectionState = () => {
	const state = useAtomValue(machineAtom)
	const foodsQuery = useSuspenseQuery(
		trpc.category.getAllForClient.queryOptions(undefined, {
			select(data) {
				if (!state.context.currentSubCategoryId) {
					throw new Error("No sub category selected")
				}
				const subCategory = data
					.flatMap((category) => category.subCategories)
					.find((subCategory) => {
						return subCategory.id === state.context.currentSubCategoryId
					})
				if (!subCategory) {
					throw new Error("Sub category not found")
				}
				return subCategory
			},
		}),
	)
	return (
		<SelectionLayout>
			<SelectionHeader>{foodsQuery.data.title}</SelectionHeader>
			<SelectionBody>
				<div className="flex flex-wrap items-center justify-center gap-8">
					{foodsQuery.data.foods.map((food) => (
						<div key={food.id}>
							<FoodCard key={food.id} {...food} />
						</div>
					))}
				</div>
				{foodsQuery.data.foods.length === 0 && (
					<SelectionEmptyState
						title="Aucune sous-catégorie disponible"
						description="Revenez plus tard, il n'y a pas de produit disponible pour cette sous-catégorie."
					/>
				)}
			</SelectionBody>
			<Separator />
			<Footer />
		</SelectionLayout>
	)
}
