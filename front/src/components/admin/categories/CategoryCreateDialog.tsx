import { categoryFormSchema } from "@/components/admin/categories/categoryFormSchema"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusCircleIcon, XCircleIcon } from "lucide-react"
import { type ReactNode, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const CategoryCreateDialog = (props: {
	children: ReactNode
	cb?: (id: string) => void
}) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof categoryFormSchema>>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			title: "",
		},
	})

	const formRef = useRef<HTMLFormElement>(null)

	const createCategoryMutation = useMutation(
		trpc.category.create.mutationOptions({
			async onSuccess(data) {
				toast.success("Catégorie ajoutée avec succès.")
				form.reset()
				await queryClient.invalidateQueries({
					queryKey: trpc.category.getAll.queryKey(),
				})
				props.cb?.(data.id)
				setOpen(false)
			},
			onError(err) {
				console.error(err)
				toast.error("Une erreur est survenue lors de l'ajout de la catégorie.")
			},
		}),
	)

	const onSubmit = async (data: z.infer<typeof categoryFormSchema>) => {
		createCategoryMutation.mutate(data)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
			<DialogTrigger asChild={true}>{props.children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ajouter une catégorie</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.stopPropagation()
							form.handleSubmit(onSubmit)(e)
						}}
						className="space-y-8"
						ref={formRef}
					>
						<FormField
							name="title"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Titre</FormLabel>
									<FormControl>
										<Input placeholder="Titre" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button
						variant="outline"
						type="button"
						onClick={() => {
							setOpen(false)
							form.reset()
						}}
					>
						<XCircleIcon />
						Annuler
					</Button>
					<Button
						onClick={() => {
							formRef.current?.dispatchEvent(
								new Event("submit", {
									bubbles: true,
									cancelable: true,
								}),
							)
						}}
						disabled={createCategoryMutation.isPending}
					>
						<PlusCircleIcon />
						Ajouter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
