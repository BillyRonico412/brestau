import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/trpc"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export const Route = createRootRoute({
	component: Root,
})

function Root() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Outlet />
			</QueryClientProvider>
			<Toaster />
			<TanStackRouterDevtools />
		</>
	)
}
