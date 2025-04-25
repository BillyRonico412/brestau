import { Footer } from "@/components/states/Footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { machineAtom } from "@/lib/machine/machine"
import { trpc, type Outputs } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"
import { CircleAlertIcon } from "lucide-react"

const SubCategoryCard = (
	props: Outputs["subCategory"]["getByCategoryId"]["subCategories"][number],
) => {
	const send = useSetAtom(machineAtom)
	return (
		<Card
			className="w-48 cursor-pointer bg-muted p-0 transition-colors hover:bg-accent"
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
		trpc.subCategory.getByCategoryId.queryOptions(
			{
				categoryId: state.context.currentCategoryId,
			},
			{
				enabled: !!state.context.currentCategoryId,
			},
		),
	)
	return (
		<div className="flex h-dvh w-dvw py-12">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-y-4 overflow-hidden">
				<p className="text-center font-semibold text-xl">
					{subCategoriesQuery.data.title}
				</p>
				<ScrollArea className="flex flex-1 overflow-y-auto px-4 py-2">
					<div className="flex w-full flex-wrap items-center justify-center gap-8">
						{subCategoriesQuery.data.subCategories.map((subCategory) => (
							<div key={subCategory.id}>
								<SubCategoryCard key={subCategory.id} {...subCategory} />
							</div>
						))}
					</div>
					{subCategoriesQuery.data.subCategories.length === 0 && (
						<Alert>
							<CircleAlertIcon className="h-4 w-4" />
							<AlertTitle>Aucune sous-catégorie disponible</AlertTitle>
							<AlertDescription>
								Aucune sous-catégorie disponible pour cette catégorie.
							</AlertDescription>
						</Alert>
					)}
				</ScrollArea>
				<div className="flex items-center justify-center gap-4">
					<Footer />
				</div>
			</div>
		</div>
	)
}
