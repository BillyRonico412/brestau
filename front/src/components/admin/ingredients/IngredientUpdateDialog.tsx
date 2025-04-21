import { ingredientFormSchema } from "@/components/admin/ingredients/ingredientFormSchema"
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
import { Switch } from "@/components/ui/switch"
import { type Outputs, trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { EditIcon, XCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const IngredientUpdateDialog = (props: {
	ingredient: Outputs["ingredient"]["getAll"][number]
}) => {
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof ingredientFormSchema>>({
		resolver: zodResolver(ingredientFormSchema),
		defaultValues: {
			title: props.ingredient.title,
			vegetarian: props.ingredient.vegetarian,
			halal: props.ingredient.halal,
			noGluten: props.ingredient.noGluten,
			noLactose: props.ingredient.noLactose,
		},
	})

	useEffect(() => {
		form.reset({
			title: props.ingredient.title,
			vegetarian: props.ingredient.vegetarian,
			halal: props.ingredient.halal,
			noGluten: props.ingredient.noGluten,
			noLactose: props.ingredient.noLactose,
		})
	}, [props.ingredient, form])

	const formRef = useRef<HTMLFormElement>(null)

	const updateIngredientMutation = useMutation(
		trpc.ingredient.update.mutationOptions({
			async onSuccess() {
				toast.success("Ingrédient mis à jour avec succès.")
				form.reset()
				setOpen(false)
			},
			onError() {
				toast.error("Une erreur est survenue lors de la mise à jour.")
			},
		}),
	)

	const onSubmit = (data: z.infer<typeof ingredientFormSchema>) => {
		updateIngredientMutation.mutate({ id: props.ingredient.id, ...data })
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild={true}>
				<Button variant="outline" size="icon">
					<EditIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifier l'ingrédient</DialogTitle>
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
								<FormItem className="flex items-center gap-x-2">
									<FormLabel>Titre</FormLabel>
									<FormControl>
										<Input placeholder="Titre" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="vegetarian"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex items-center gap-x-2">
									<FormLabel>Végétarien</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="halal"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex items-center gap-x-2">
									<FormLabel>Halal</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="noGluten"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex items-center gap-x-2">
									<FormLabel>Sans gluten</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="noLactose"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex items-center gap-x-2">
									<FormLabel>Sans lactose</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
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
						onClick={() => {
							setOpen(false)
							form.reset()
						}}
					>
						<XCircleIcon />
						Annuler
					</Button>
					<Button
						onClick={() => formRef.current?.dispatchEvent(new Event("submit"))}
					>
						<EditIcon />
						Modifier
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
