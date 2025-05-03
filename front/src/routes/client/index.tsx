import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useSubscription } from "@trpc/tanstack-react-query"

export const Route = createFileRoute("/client/")({
	component: RouteComponent,
})

const Column = (props: {
	title: string
	orderCounters: number[]
}) => {
	return (
		<Card className="flex h-full flex-col p-4">
			<p className="text-center font-bold text-2xl">{props.title}</p>
			<div className="flex flex-1 flex-wrap items-start gap-4 overflow-y-auto">
				{props.orderCounters.map((orderCounter) => (
					<Badge key={orderCounter} className="text-xl">
						#{orderCounter}
					</Badge>
				))}
			</div>
		</Card>
	)
}

function RouteComponent() {
	const orderClientInfos = useSuspenseQuery(
		trpc.order.getOrderClientInfos.queryOptions(),
	)
	const queryClient = useQueryClient()
	useSubscription(
		trpc.order.notifyUpdateOrder.subscriptionOptions(undefined, {
			enabled: true,
			onData() {
				queryClient.invalidateQueries({
					queryKey: trpc.order.getOrderClientInfos.queryKey(),
				})
			},
		}),
	)
	return (
		<div className="flex h-dvh w-dvw font-display">
			<div className="mx-auto grid h-full w-full max-w-7xl grid-cols-3 gap-4 px-4 py-8">
				<Column
					title="En attente"
					orderCounters={orderClientInfos.data.pendingCounters}
				/>
				<Column
					title="En préparation"
					orderCounters={orderClientInfos.data.inProgressCounters}
				/>
				<Column
					title="Fini"
					orderCounters={orderClientInfos.data.completedCounters}
				/>
			</div>
		</div>
	)
}
