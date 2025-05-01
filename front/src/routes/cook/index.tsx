import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { type Outputs, trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useSubscription } from "@trpc/tanstack-react-query"
import {
	CheckIcon,
	CookingPotIcon,
	UserRoundCheckIcon,
	UserRoundXIcon,
} from "lucide-react"
import { match } from "ts-pattern"

const notificationSound = new Audio("/notification.mp3")

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

const OrderItemCard = (props: {
	orderItem: Outputs["order"]["getOrderItems"][number]["items"][number]
}) => {
	const updateOrderItemStatusMutation = useMutation(
		trpc.order.updateOrderItemStatus.mutationOptions(),
	)
	const session = authClient.useSession()
	const user = session.data?.user
	if (!user) {
		return null
	}
	return (
		<Card
			className={cn("flex flex-col gap-y-4 px-6 py-2", {
				"bg-yellow-400/20": props.orderItem.status === "IN_PROGRESS",
				"bg-green-400/20": props.orderItem.status === "COMPLETED",
			})}
		>
			<div className="flex flex-col items-center gap-x-6 gap-y-4 sm:flex-row">
				<img
					src={props.orderItem.food.image}
					alt={props.orderItem.food.title}
					className="aspect-square h-12 rounded-md object-cover"
				/>
				<p className="text-sm">
					<span className="font-medium">{props.orderItem.food.title} </span>x
					<span> {props.orderItem.quantity}</span>
				</p>
				{props.orderItem.removedIngredients.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{props.orderItem.removedIngredients.length > 0 &&
							props.orderItem.removedIngredients.map((ingredient) => (
								<Badge variant="destructive" key={ingredient.id}>
									{ingredient.title}
								</Badge>
							))}
					</div>
				)}
				{match(props.orderItem.status)
					.with("PENDING", () => (
						<Button
							size="icon"
							className="sm:ml-auto"
							onClick={() => {
								updateOrderItemStatusMutation.mutate({
									orderItemId: props.orderItem.id,
									orderItemStatus: "IN_PROGRESS",
									cookerId: user.id,
								})
							}}
						>
							<CookingPotIcon />
						</Button>
					))
					.with("IN_PROGRESS", () => (
						<Button
							size="icon"
							className="sm:ml-auto"
							onClick={() => {
								updateOrderItemStatusMutation.mutate({
									orderItemId: props.orderItem.id,
									orderItemStatus: "COMPLETED",
									cookerId: user.id,
								})
							}}
						>
							<CheckIcon />
						</Button>
					))
					.otherwise(() => null)}
			</div>
			<div className="mx-auto sm:mr-0 sm:ml-0">
				<Badge variant="secondary" className="inline-flex items-center gap-x-2">
					{props.orderItem.cooker ? (
						<UserRoundCheckIcon size={12} />
					) : (
						<UserRoundXIcon size={12} />
					)}
					{props.orderItem.cooker ? props.orderItem.cooker.name : "Aucun"}
				</Badge>
			</div>
		</Card>
	)
}

const OrderCard = (props: {
	order: Outputs["order"]["getOrderItems"][number]
	index: number
}) => {
	const { order } = props
	return (
		<Card className="relative flex flex-col gap-4 bg-muted p-4">
			<p className="font-semibold">Commande #{order.counter}</p>
			{order.items.map((orderItem) => (
				<OrderItemCard key={orderItem.id} orderItem={orderItem} />
			))}
		</Card>
	)
}

function RouteComponent() {
	const orderItemsQuery = useSuspenseQuery(
		trpc.order.getOrderItems.queryOptions(),
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

	return (
		<div className="items-center-safe justify-center-safe flex h-dvh w-dvw overflow-y-auto px-4 py-8">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
				{orderItemsQuery.data.map((order, i) => (
					<OrderCard key={order.id} order={order} index={i} />
				))}
			</div>
		</div>
	)
}
