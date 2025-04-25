import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { machineAtom } from "@/lib/machine/machine"
import { trpc } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { CircleAlertIcon } from "lucide-react"

export const CategorySelectionState = () => {
	const categoriesQuery = useSuspenseQuery(trpc.category.getAll.queryOptions())
	const send = useSetAtom(machineAtom)
	return (
		<div className="flex h-dvh w-dvw">
			<div className="mx-auto my-auto flex w-full max-w-7xl flex-col items-center gap-y-4 px-4 py-2">
				<p className="font-display font-semibold text-xl">
					Choisis une catégorie
				</p>
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
						<Alert>
							<CircleAlertIcon className="h-4 w-4" />
							<AlertTitle>Aucune catégorie disponible</AlertTitle>
							<AlertDescription>
								Aucune catégorie disponible pour cette catégorie.
							</AlertDescription>
						</Alert>
					)}
				</div>
			</div>
		</div>
	)
}
