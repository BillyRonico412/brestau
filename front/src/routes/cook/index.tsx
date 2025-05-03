import { OrderCard } from "@/components/order/Order"
import { notificationSound } from "@/components/utils/notification"
import { authClient } from "@/lib/auth-client"
import { trpc } from "@/lib/trpc"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useSubscription } from "@trpc/tanstack-react-query"

export const Route = createFileRoute("/cook/")({
	component: RouteComponent,
	async beforeLoad(ctx) {
		const session = await authClient.getSession()
		if (
			!session.data ||
			(session.data.user.userType !== "admin" &&
				session.data.user.userType !== "cook")
		) {
			throw redirect({
				to: "/login",
				search: {
					redirect: ctx.location.href,
				},
			})
		}
	},
})

function RouteComponent() {
	const orderItemsQuery = useSuspenseQuery(
		trpc.order.getOrderItems.queryOptions(undefined, {
			select(data) {
				return data.filter((order) =>
					order.items.some(
						(item) =>
							item.status === "IN_PROGRESS" || item.status === "PENDING",
					),
				)
			},
		}),
	)
	const queryClient = useQueryClient()
	useSubscription(
		trpc.order.notifyUpdateOrder.subscriptionOptions(undefined, {
			enabled: true,
			onData() {
				queryClient.invalidateQueries({
					queryKey: trpc.order.getOrderItems.queryKey(),
				})
			},
		}),
	)

	useSubscription(
		trpc.order.notifyCreateOrder.subscriptionOptions(undefined, {
			enabled: true,
			onData() {
				notificationSound.play()
			},
		}),
	)

	if (orderItemsQuery.data.length === 0) {
		return (
			<div className="items-center-safe justify-center-safe flex h-dvh w-dvw overflow-y-auto px-4 py-8">
				<p className="font-bold text-2xl">Aucune commande en cours</p>
			</div>
		)
	}

	return (
		<div className="items-center-safe justify-center-safe flex h-dvh w-dvw overflow-y-auto px-4 py-8">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
				{orderItemsQuery.data.map((order, i) => (
					<OrderCard key={order.id} order={order} index={i} type="cook" />
				))}
			</div>
		</div>
	)
}
