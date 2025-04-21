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

export const FoodDeleteDialog = ({ foodId }: { foodId: string }) => {
	const queryClient = useQueryClient()
	const getAllQueryKey = trpc.food.getAll.queryKey()
	const deleteMutation = useMutation(
		trpc.food.delete.mutationOptions({
			async onSuccess() {
				await queryClient.invalidateQueries({
					queryKey: getAllQueryKey,
				})
				toast.success("Produit supprimé avec succès.")
			},
			onError() {
				toast.error(
					"Une erreur est survenue lors de la suppression du produit.",
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
					<AlertDialogTitle>
						Êtes-vous sûr de vouloir supprimer ce produit ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Vous ne pourrez pas récupérer ce
						produit une fois supprimé.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						<XCircleIcon />
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMutation.mutate({ id: foodId })
						}}
						disabled={deleteMutation.isPending}
					>
						<Trash2Icon />
						Supprimer
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
