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
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { LogIn } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const zodValidateSearch = z.object({
	redirect: z.string().optional(),
})

const formSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export const Route = createFileRoute("/login")({
	component: IndexComponent,
	async beforeLoad() {
		const session = await authClient.getSession()
		if (!session.data) {
			return
		}
		if (session.data.user.userType === "admin") {
			throw redirect({
				to: "/admin/categories",
			})
		}
		if (session.data.user.userType === "cook") {
			throw redirect({
				to: "/cook",
			})
		}
		throw redirect({
			to: "/",
		})
	},
	validateSearch(search) {
		return zodValidateSearch.parse(search)
	},
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
	const navigate = useNavigate()
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		await authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				rememberMe: true,
			},
			{
				onError(context) {
					console.error(context.error)
					toast.error("Erreur lors de la connexion")
				},
				async onSuccess() {
					const session = await authClient.getSession()
					if (!session.data) {
						toast.error("Erreur lors de la connexion")
						return
					}
					if (search.redirect?.startsWith(`/${session.data.user.userType}`)) {
						return navigate({
							to: search.redirect,
						})
					}
					if (session.data.user.userType === "admin") {
						return navigate({
							to: "/admin/categories",
						})
					}
					if (session.data.user.userType === "cook") {
						return navigate({
							to: "/cook",
						})
					}
				},
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
