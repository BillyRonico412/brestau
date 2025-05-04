import { OrderCard } from "@/components/order/Order"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { notificationSound } from "@/components/utils/notification"
import { authClient } from "@/lib/auth-client"
import { trpc } from "@/lib/trpc"
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useSubscription } from "@trpc/tanstack-react-query"
import { CheckCheckIcon, HourglassIcon } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/server/")({
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
	component: RouteComponent,
})

function RouteComponent() {
	const [selectedMode, setSelectMode] = useState<"completed" | "in-progress">(
		"completed",
	)
	const orderItemsQuery = useSuspenseQuery(
		trpc.order.getOrderItems.queryOptions(undefined, {
			select(data) {
				switch (selectedMode) {
					case "completed":
						return data.filter((order) =>
							order.items.every((item) => item.status === "COMPLETED"),
						)
					case "in-progress":
						return data.filter((order) =>
							order.items.some(
								(item) =>
									item.status === "IN_PROGRESS" || item.status === "PENDING",
							),
						)
					default:
						return data
				}
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
		trpc.order.notifyOrderReadyToCompleted.subscriptionOptions(undefined, {
			enabled: true,
			onData() {
				notificationSound.play()
			},
		}),
	)

	return (
		<div className="items-center-safe justify-center-safe flex h-dvh w-dvw flex-col overflow-y-auto px-4 py-8">
			{orderItemsQuery.data.length === 0 && (
				<p className="text-center font-bold text-2xl">
					{selectedMode === "completed"
						? "Aucune commande terminée"
						: "Aucune commande en cours"}
				</p>
			)}
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
				{orderItemsQuery.data.map((order, i) => (
					<OrderCard key={order.id} order={order} index={i} type="server" />
				))}
			</div>
			<Card className="fixed bottom-4 flex flex-row items-center gap-2 p-2">
				<Button
					size="icon"
					variant={selectedMode === "completed" ? "default" : "ghost"}
					onClick={() => {
						setSelectMode("completed")
					}}
				>
					<CheckCheckIcon />
				</Button>
				<Button
					size="icon"
					variant={selectedMode === "in-progress" ? "default" : "ghost"}
					onClick={() => {
						setSelectMode("in-progress")
					}}
				>
					<HourglassIcon />
				</Button>
			</Card>
		</div>
	)
}
