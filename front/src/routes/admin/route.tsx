import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/utils/theme-provider"
import { authClient } from "@/lib/auth-client"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
	async beforeLoad(ctx) {
		const session = await authClient.getSession()
		if (!session.data || session.data.user.userType !== "admin") {
			throw redirect({
				to: "/login",
				search: {
					redirect: ctx.location.href,
				},
			})
		}
		if (
			ctx.location.pathname === "/admin" ||
			ctx.location.pathname === "/admin/"
		) {
			throw redirect({
				to: "/admin/foods",
			})
		}
	},
})

function RouteComponent() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<SidebarProvider>
				<AdminSidebar />
				<main className="flex h-dvh w-full flex-col overflow-hidden">
					<SidebarTrigger />
					<Outlet />
				</main>
			</SidebarProvider>
		</ThemeProvider>
	)
}
