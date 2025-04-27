import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeftCircleIcon } from "lucide-react"

export const Route = createFileRoute("/payment/success")({
	component: RouteComponent,
})

function RouteComponent() {
	const orderId = new URLSearchParams(window.location.search).get("orderId")
	const foodByOrderIdQuery = useSuspenseQuery(
		trpc.order.getFoodByOrderId.queryOptions(
			{
				id: orderId || "",
			},
			{
				enabled: !!orderId,
			},
		),
	)

	if (!orderId) {
		return <div>Order ID not found</div>
	}
	return (
		<div className="items-center-safe justify-center-safe mx-auto flex h-dvh w-full max-w-7xl flex-col gap-12 overflow-y-auto px-4 py-2">
			<p className="text-9xl">🎉</p>
			<p className="font-bold text-xl">Paiement réussi !</p>
			<p>Votre commande porte le numéro</p>
			<p className="font-black text-3xl">{foodByOrderIdQuery.data.counter}</p>
			<p className="font-medium text-lg">
				Votre commande est en cours de traitement. 👨‍🍳
			</p>
			<p className="text-sm">Voici le récapitulatif de votre commande :</p>
			<ul className="list-disc">
				{foodByOrderIdQuery.data.items.map((item) => (
					<li key={item.food.id}>
						{item.quantity} x {item.food.title} = <span> </span>
						{item.food.price * item.quantity} €
					</li>
				))}
			</ul>
			<Link to="/">
				<Button size="lg">
					<ChevronLeftCircleIcon />
					Retour à l'accueil
				</Button>
			</Link>
		</div>
	)
}
