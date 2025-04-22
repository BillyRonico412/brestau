import { ModeToggle } from "@/components/utils/mode-toggle"
import { Button } from "@/components/ui/button"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router"
import {
	BeefIcon,
	LayersIcon,
	ListIcon,
	LogOutIcon,
	PizzaIcon,
} from "lucide-react"
import { toast } from "sonner"

const items = [
	{
		title: "Catégories",
		url: "/admin/categories",
		icon: LayersIcon,
	},
	{
		title: "Sous-catégories",
		url: "/admin/subcategories",
		icon: ListIcon,
	},
	{
		title: "Produits",
		url: "/admin/foods",
		icon: PizzaIcon,
	},
	{
		title: "Ingrédients",
		url: "/admin/ingredients",
		icon: BeefIcon,
	},
] as const

export const AdminSidebar = () => {
	const matchRoute = useMatchRoute()
	const navigate = useNavigate()
	return (
		<Sidebar>
			<SidebarHeader>
				<h1 className={cn("text-center font-bold font-display text-xl")}>
					🍔 BRestau 🍸
				</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Aliments</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild={true}
										isActive={!!matchRoute({ to: item.url })}
									>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="items-center">
				<ModeToggle />
				<Button
					className="w-full"
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onError(context) {
									console.error(context.error)
									toast.error("Erreur lors de la déconnexion")
								},
								onSuccess() {
									toast.success("Déconnexion réussie")
									navigate({
										to: "/",
									})
								},
							},
						})
					}}
				>
					<LogOutIcon />
					Déconnexion
				</Button>
			</SidebarFooter>
		</Sidebar>
	)
}
