import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon, XCircleIcon } from "lucide-react"
import { toast } from "sonner"

export const IngredientDeleteDialog = (props: { ingredientId: string }) => {
	const queryClient = useQueryClient()
	const deleteMutation = useMutation(
		trpc.ingredient.delete.mutationOptions({
			async onSuccess() {
				toast.success("Ingrédient supprimé avec succès.")
				await queryClient.invalidateQueries({
					queryKey: trpc.ingredient.getAll.queryKey(),
				})
			},
			onError() {
				toast.error(
					"Une erreur est survenue lors de la suppression de l'ingrédient.",
				)
			},
		}),
	)

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild={true}>
				<Button size="icon" variant="destructive">
					<Trash2Icon />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Supprimer l'ingrédient</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Voulez-vous continuer ?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						<XCircleIcon />
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => deleteMutation.mutate({ id: props.ingredientId })}
					>
						<Trash2Icon />
						Supprimer
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
