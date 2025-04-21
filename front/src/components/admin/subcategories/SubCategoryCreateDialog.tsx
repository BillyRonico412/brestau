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
import { trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query"
import { PlusCircleIcon, XCircleIcon } from "lucide-react"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const SubCategoryCreateDialog = (props: {
	children: ReactNode
	cb?: (id: string) => void
}) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof subCategoryFormSchema>>({
		resolver: zodResolver(subCategoryFormSchema),
		defaultValues: {
			title: "",
			image: undefined,
			categoryId: "",
		},
	})

	const formRef = useRef<HTMLFormElement>(null)

	const categoriesQuery = useSuspenseQuery(trpc.category.getAll.queryOptions())

	const createSubCategoryMutation = useMutation(
		trpc.subCategory.create.mutationOptions({
			async onSuccess(data) {
				toast.success("Sous-catégorie ajoutée avec succès.")
				form.reset()
				await queryClient.invalidateQueries({
					queryKey: trpc.subCategory.getAll.queryKey(),
				})
				props.cb?.(data.id)
				setOpen(false)
			},
			onError(err) {
				console.error(err)
				toast.error(
					"Une erreur est survenue lors de l'ajout de la sous-catégorie.",
				)
			},
		}),
	)

	const [createdId, setCreatedId] = useState<string | undefined>(undefined)

	useEffect(() => {
		if (createdId && categoriesQuery.data.some((c) => c.id === createdId)) {
			form.setValue("categoryId", createdId)
		}
		setCreatedId(undefined)
	}, [createdId, categoriesQuery.data, form])

	const onSubmit = async (data: z.infer<typeof subCategoryFormSchema>) => {
		const formData = new FormData()
		formData.append("title", data.title)
		formData.append("image", data.image)
		formData.append("categoryId", data.categoryId)
		createSubCategoryMutation.mutate(formData)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
			<DialogTrigger asChild={true}>{props.children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ajouter une sous-catégorie</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.stopPropagation()
							form.handleSubmit(onSubmit)(e)
						}}
						encType="multipart/form-data"
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
						disabled={createSubCategoryMutation.isPending}
					>
						<PlusCircleIcon />
						Ajouter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
