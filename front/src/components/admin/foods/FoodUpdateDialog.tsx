import { foodFormSchema } from "@/components/admin/foods/foodFormSchema"
import { IngredientCreateDialog } from "@/components/admin/ingredients/IngredientCreateDialog"
import { SubCategoryCreateDialog } from "@/components/admin/subcategories/SubCategoryCreateDialog"
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
import { MultiSelect } from "@/components/ui/multi-select"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

const foodFormSchemaOptional = foodFormSchema.extend({
	image: z.instanceof(File).optional(),
})

export const FoodUpdateDialog = (props: {
	food: Outputs["food"]["getAll"][number]
}) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof foodFormSchemaOptional>>({
		resolver: zodResolver(foodFormSchemaOptional),
		defaultValues: {
			title: props.food.title,
			description: props.food.description,
			image: undefined,
			price: props.food.price,
			subCategoryId: props.food.subCategoryId,
			estimatedTimeMn: props.food.estimatedTimeMn,
			ingredientIds: props.food.ingredients.map((i) => i.id),
		},
	})

	useEffect(() => {
		if (open) {
			form.reset({
				title: props.food.title,
				description: props.food.description,
				image: undefined,
				price: props.food.price,
				subCategoryId: props.food.subCategoryId,
				estimatedTimeMn: props.food.estimatedTimeMn,
				ingredientIds: props.food.ingredients.map((i) => i.id),
			})
		}
	}, [open, props.food, form.reset])

	const formRef = useRef<HTMLFormElement>(null)

	const subCategoriesQuery = useSuspenseQuery(
		trpc.subCategory.getAll.queryOptions(),
	)
	const [subCategoryIdCreated, setSubCategoryIdCreated] = useState<
		string | undefined
	>(undefined)

	useEffect(() => {
		if (
			subCategoryIdCreated &&
			subCategoriesQuery.data.some(
				(subCategory) => subCategory.id === subCategoryIdCreated,
			)
		) {
			form.setValue("subCategoryId", subCategoryIdCreated)
			setSubCategoryIdCreated(undefined)
		}
	}, [subCategoryIdCreated, subCategoriesQuery.data, form])

	const ingredientsQuery = useSuspenseQuery(
		trpc.ingredient.getAll.queryOptions(),
	)
	const [ingredientIdCreated, setIngredientIdCreated] = useState<
		string | undefined
	>(undefined)

	useEffect(() => {
		if (
			ingredientIdCreated &&
			ingredientsQuery.data.some(
				(ingredient) => ingredient.id === ingredientIdCreated,
			)
		) {
			form.setValue("ingredientIds", [
				...form.getValues("ingredientIds"),
				ingredientIdCreated,
			])
			setIngredientIdCreated(undefined)
		}
	}, [ingredientIdCreated, ingredientsQuery.data, form])

	const updateFoodMutation = useMutation(
		trpc.food.update.mutationOptions({
			async onSuccess() {
				toast.success("Plat mis à jour avec succès.")
				form.reset()
				await queryClient.invalidateQueries({
					queryKey: trpc.food.getAll.queryKey(),
				})
				setOpen(false)
			},
			onError(err) {
				console.error(err)
				toast.error("Une erreur est survenue lors de la mise à jour du plat.")
			},
		}),
	)

	const onSubmit = (data: z.infer<typeof foodFormSchemaOptional>) => {
		const formData = new FormData()
		formData.append("id", props.food.id)
		formData.append("title", data.title)
		formData.append("description", data.description)
		if (data.image) {
			formData.append("image", data.image)
		}
		formData.append("price", data.price.toString())
		formData.append("subCategoryId", data.subCategoryId)
		formData.append("estimatedTimeMn", data.estimatedTimeMn.toString())
		updateFoodMutation.mutate(formData)
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
					<DialogTitle>Modifier le produit</DialogTitle>
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
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Description" {...field} />
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
							name="price"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prix</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Prix"
											{...field}
											onChange={(event) => field.onChange(+event.target.value)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="subCategoryId"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sous-catégorie</FormLabel>
									<div className="flex items-center gap-2">
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez une sous-catégorie" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{subCategoriesQuery.data.map((subCategory) => (
													<SelectItem
														key={subCategory.id}
														value={subCategory.id}
													>
														{subCategory.title}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<SubCategoryCreateDialog
											cb={(id) => {
												setSubCategoryIdCreated(id)
											}}
										>
											<Button variant="outline" type="button" size="icon">
												<PlusCircleIcon />
											</Button>
										</SubCategoryCreateDialog>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="estimatedTimeMn"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Temps estimé (minutes)</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Temps estimé"
											{...field}
											onChange={(event) => field.onChange(+event.target.value)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="ingredientIds"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ingrédients</FormLabel>
									<div className="flex items-center gap-2">
										<MultiSelect
											options={ingredientsQuery.data.map((ingredient) => ({
												label: ingredient.title,
												value: ingredient.id,
											}))}
											onValueChange={field.onChange}
											values={field.value}
											placeholder="Sélectionnez les ingrédients"
										/>
										<IngredientCreateDialog
											cb={(id) => {
												setIngredientIdCreated(id)
											}}
										>
											<Button variant="outline" type="button" size="icon">
												<PlusCircleIcon />
											</Button>
										</IngredientCreateDialog>
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
								title: props.food.title,
								description: props.food.description,
								image: undefined,
								price: props.food.price,
								subCategoryId: props.food.subCategoryId,
								estimatedTimeMn: props.food.estimatedTimeMn,
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
						disabled={updateFoodMutation.isPending}
					>
						<EditIcon />
						Modifier
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
