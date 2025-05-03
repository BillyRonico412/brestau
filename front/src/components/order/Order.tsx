import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { authClient } from "@/lib/auth-client"
import { type Outputs, trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog"
import { useMutation } from "@tanstack/react-query"
import {
	CheckIcon,
	CookingPotIcon,
	HandPlatterIcon,
	UserRoundCheckIcon,
	UserRoundXIcon,
	XIcon,
} from "lucide-react"
import { match } from "ts-pattern"

const OrderItemCard = (props: {
	orderItem: Outputs["order"]["getOrderItems"][number]["items"][number]
	viewOnly?: boolean
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
				{!props.viewOnly &&
					match(props.orderItem.status)
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
						.with(
							"IN_PROGRESS",
							() => user.id === props.orderItem.cookerId,
							() => (
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
							),
						)
						.with(
							"IN_PROGRESS",
							() => user.id !== props.orderItem.cookerId,
							() => (
								<Dialog>
									<DialogTrigger asChild={true}>
										<Button size="icon" className="sm:ml-auto">
											<CheckIcon />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Valider une commande non préparée ?
											</DialogTitle>
											<DialogDescription>
												Cette action est irréversible et vous ne pourrez pas
												annuler la validation de la commande.
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<DialogClose>
												<Button variant="outline">
													<XIcon />
													Non
												</Button>
											</DialogClose>
											<DialogClose>
												<Button
													onClick={() => {
														updateOrderItemStatusMutation.mutate({
															orderItemId: props.orderItem.id,
															orderItemStatus: "COMPLETED",
															cookerId: user.id,
														})
													}}
												>
													<CheckIcon />
													Oui
												</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							),
						)
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

export const OrderCard = (props: {
	order: Outputs["order"]["getOrderItems"][number]
	index: number
	type: "cook" | "server"
}) => {
	const completeOrderMutation = useMutation(
		trpc.order.completeOrder.mutationOptions(),
	)
	const session = authClient.useSession()
	const user = session.data?.user
	if (!user) {
		return null
	}
	return (
		<Card className="relative flex flex-col gap-4 bg-muted p-4">
			<div className="flex items-center">
				<p className="font-semibold">Commande #{props.order.counter}</p>
				{props.type === "server" &&
					props.order.items.every((item) => item.status === "COMPLETED") && (
						<Button
							size="icon"
							className="ml-auto"
							onClick={() => {
								completeOrderMutation.mutate({
									orderId: props.order.id,
									serverId: user.id,
								})
							}}
						>
							<HandPlatterIcon />
						</Button>
					)}
			</div>
			{props.order.items.map((orderItem) => (
				<OrderItemCard
					key={orderItem.id}
					orderItem={orderItem}
					viewOnly={props.type === "server"}
				/>
			))}
		</Card>
	)
}
