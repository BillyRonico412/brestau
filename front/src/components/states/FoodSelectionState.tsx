import { Footer } from "@/components/states/Footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"

import type { Outputs } from "@/lib/trpc"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CircleAlertIcon } from "lucide-react"

const FoodCard = (
	props: Outputs["food"]["getBySubCategoryId"]["foods"][number],
) => {
	const send = useSetAtom(machineAtom)
	return (
		<Card
			className="w-48 cursor-pointer bg-muted p-0 transition-colors hover:bg-accent"
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
					{props.price.toLocaleString("fr-FR", {
						style: "currency",
						currency: "EUR",
					})}
				</p>
			</CardFooter>
		</Card>
	)
}

export const FoodSelectionState = () => {
	const state = useAtomValue(machineAtom)
	const foodsQuery = useSuspenseQuery(
		trpc.food.getBySubCategoryId.queryOptions(
			{
				subCategoryId: state.context.currentSubCategoryId,
			},
			{
				enabled: !!state.context.currentSubCategoryId,
			},
		),
	)
	return (
		<div className="flex h-dvh w-dvw py-12">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-y-4 overflow-hidden">
				<p className="text-center font-semibold text-xl">
					{foodsQuery.data.title}
				</p>
				<ScrollArea className="flex flex-1 overflow-y-auto px-4 py-2">
					<div className="flex w-full flex-wrap items-center justify-center gap-8">
						{foodsQuery.data.foods.map((food) => (
							<div key={food.id}>
								<FoodCard key={food.id} {...food} />
							</div>
						))}
						{foodsQuery.data.foods.length === 0 && (
							<Alert>
								<CircleAlertIcon className="h-4 w-4" />
								<AlertTitle>Aucune sous-catégorie disponible</AlertTitle>
								<AlertDescription>
									Aucune sous-catégorie disponible pour cette catégorie.
								</AlertDescription>
							</Alert>
						)}
					</div>
				</ScrollArea>
				<div className="flex items-center justify-center gap-4">
					<Footer />
				</div>
			</div>
		</div>
	)
}
