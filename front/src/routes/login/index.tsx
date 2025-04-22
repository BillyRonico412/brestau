import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { LogIn } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const zodValidateSearch = z.object({
	redirect: z.string().optional(),
})

export const Route = createFileRoute("/login/")({
	component: IndexComponent,
	async beforeLoad() {
		const session = await authClient.getSession()
		if (session.data) {
			throw redirect({
				to: "/admin/categories",
			})
		}
	},
	validateSearch(search) {
		return zodValidateSearch.parse(search)
	},
})

const formSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

function IndexComponent() {
	const search = Route.useSearch()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				rememberMe: true,
				callbackURL: search.redirect ?? "/admin",
			},
			{
				onError(context) {
					console.error(context.error)
					toast.error("Erreur lors de la connexion")
				},
				onSuccess() {
					toast.success("Connexion réussie")
				},
				credentials: "include",
			},
		)
	}

	return (
		<div className="flex h-dvh w-dvw">
			<div className="mx-auto my-auto flex w-full max-w-sm flex-col items-center justify-center gap-y-8">
				<h1 className={cn("font-bold font-display text-4xl")}>🍔 BRestau 🍸</h1>
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.stopPropagation()
							form.handleSubmit(onSubmit)(e)
						}}
						className="w-full space-y-8"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="johndoe@mail.fr" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mot de passe</FormLabel>
									<FormControl>
										<Input type="password" placeholder="********" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit">
							<LogIn />
							Se connecter
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
