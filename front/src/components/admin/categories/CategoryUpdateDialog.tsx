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
import { type Outputs, trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EditIcon, XCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const CategoryUpdateDialog = (props: {
	category: Outputs["category"]["getAll"][number]
}) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof categoryFormSchema>>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			title: props.category.title,
		},
	})

	useEffect(() => {
		if (open) {
			form.reset({ title: props.category.title })
		}
	}, [open, props.category.title, form.reset])

	const formRef = useRef<HTMLFormElement>(null)

	const updateCategoryMutation = useMutation({
		...trpc.category.update.mutationOptions(),
		async onSuccess() {
			toast.success("Catégorie mise à jour avec succès.")
			form.reset()
			await queryClient.invalidateQueries({
				queryKey: trpc.category.getAll.queryKey(),
			})
			setOpen(false)
		},
		onError(err) {
			console.error(err)
			toast.error(
				"Une erreur est survenue lors de la mise à jour de la catégorie.",
			)
		},
	})

	const onSubmit = (data: z.infer<typeof categoryFormSchema>) => {
		updateCategoryMutation.mutate({ id: props.category.id, ...data })
	}

	return (
		<Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
			<DialogTrigger asChild={true}>
				<Button variant="outline" size="icon">
					<EditIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifier la catégorie</DialogTitle>
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
							form.reset({ title: props.category.title })
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
						disabled={updateCategoryMutation.isPending}
					>
						<EditIcon />
						Modifier
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
