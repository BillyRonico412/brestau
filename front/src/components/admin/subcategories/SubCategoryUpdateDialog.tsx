import { CategoryCreateDialog } from "@/components/admin/categories/CategoryCreateDialog"
import { subCategoryFormSchema } from "@/components/admin/subcategories/subCategoryFormSchema"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { type Outputs, trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query"
import { EditIcon, PlusCircleIcon, XCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const subCategoryFormSchemaOptional = subCategoryFormSchema.extend({
	image: z.instanceof(File).optional(),
})
export const SubCategoryUpdateDialog = (props: {
	subCategory: Outputs["subCategory"]["getAll"][number]
}) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof subCategoryFormSchemaOptional>>({
		resolver: zodResolver(subCategoryFormSchemaOptional),
		defaultValues: {
			title: props.subCategory.title,
			image: undefined,
			categoryId: props.subCategory.categoryId,
		},
	})

	useEffect(() => {
		if (open) {
			form.reset({
				title: props.subCategory.title,
				image: undefined,
				categoryId: props.subCategory.categoryId,
			})
		}
	}, [open, props.subCategory, form.reset])

	const formRef = useRef<HTMLFormElement>(null)

	const categoriesQuery = useSuspenseQuery(trpc.category.getAll.queryOptions())
	const [createdId, setCreatedId] = useState<string | undefined>(undefined)

	useEffect(() => {
		if (createdId && categoriesQuery.data.some((c) => c.id === createdId)) {
			form.setValue("categoryId", createdId)
			setCreatedId(undefined)
		}
	}, [createdId, categoriesQuery.data, form])

	const updateSubCategoryMutation = useMutation(
		trpc.subCategory.update.mutationOptions({
			async onSuccess() {
				toast.success("Sous-catégorie mise à jour avec succès.")
				form.reset()
				await queryClient.invalidateQueries({
					queryKey: trpc.subCategory.getAll.queryKey(),
				})
				setOpen(false)
			},
			onError(err) {
				console.error(err)
				toast.error(
					"Une erreur est survenue lors de la mise à jour de la sous-catégorie.",
				)
			},
		}),
	)

	const onSubmit = (data: z.infer<typeof subCategoryFormSchemaOptional>) => {
		const formData = new FormData()
		formData.append("id", props.subCategory.id)
		formData.append("title", data.title)
		if (data.image) {
			formData.append("image", data.image)
		}
		formData.append("categoryId", data.categoryId)
		updateSubCategoryMutation.mutate(formData)
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
					<DialogTitle>Modifier la sous-catégorie</DialogTitle>
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
						<FormField
							name="image"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => field.onChange(e.target.files?.[0])}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="categoryId"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Catégorie</FormLabel>
									<div className="flex items-center gap-2">
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez une catégorie" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categoriesQuery.data.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.title}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<CategoryCreateDialog
											cb={(id) => {
												setCreatedId(id)
											}}
										>
											<Button variant="outline" size="icon">
												<PlusCircleIcon />
											</Button>
										</CategoryCreateDialog>
									</div>
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
							form.reset({
								title: props.subCategory.title,
								image: undefined,
								categoryId: props.subCategory.categoryId,
							})
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
						disabled={updateSubCategoryMutation.isPending}
					>
						<EditIcon />
						Modifier
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
