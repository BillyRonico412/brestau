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

export const SubCategoryDeleteDialog = ({
	subCategoryId,
}: { subCategoryId: string }) => {
	const queryClient = useQueryClient()
	const getAllQueryKey = trpc.subCategory.getAll.queryKey()
	const deleteMutation = useMutation(
		trpc.subCategory.delete.mutationOptions({
			async onSuccess() {
				await queryClient.invalidateQueries({
					queryKey: getAllQueryKey,
				})
				toast.success("Sous-catégorie supprimée avec succès")
			},
			onError() {
				toast.error(
					"Une erreur est survenue lors de la suppression de la sous-catégorie",
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
						Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Vous ne pourrez pas récupérer cette
						sous-catégorie une fois supprimée.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						<XCircleIcon />
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMutation.mutate({ id: subCategoryId })
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
