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
import { trpc } from "@/lib/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusCircleIcon, XCircleIcon } from "lucide-react"
import { type ReactNode, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const IngredientCreateDialog = (props: {
	children: ReactNode
	cb?: (id: string) => void
}) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof ingredientFormSchema>>({
		resolver: zodResolver(ingredientFormSchema),
		defaultValues: {
			title: "",
			vegetarian: true,
			halal: true,
			noGluten: true,
			noLactose: true,
		},
	})

	const formRef = useRef<HTMLFormElement>(null)

	const createIngredientMutation = useMutation(
		trpc.ingredient.create.mutationOptions({
			async onSuccess(data) {
				toast.success("Ingrédient ajouté avec succès.")
				form.reset()
				await queryClient.invalidateQueries({
					queryKey: trpc.ingredient.getAll.queryKey(),
				})
				props.cb?.(data.id)
				setOpen(false)
			},
			onError() {
				toast.error("Une erreur est survenue lors de l'ajout de l'ingrédient.")
			},
		}),
	)

	const onSubmit = (data: z.infer<typeof ingredientFormSchema>) => {
		createIngredientMutation.mutate(data)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild={true}>{props.children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ajouter un ingrédient</DialogTitle>
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
						onClick={() =>
							formRef.current?.dispatchEvent(
								new Event("submit", {
									bubbles: true,
									cancelable: true,
								}),
							)
						}
						disabled={createIngredientMutation.isPending}
					>
						<PlusCircleIcon />
						Ajouter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
