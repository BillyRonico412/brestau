import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeftCircleIcon } from "lucide-react"

export const Route = createFileRoute("/payment/cancel")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="items-center-safe justify-center-safe flex h-dvh w-dvw px-4 py-2">
			<div className="max-w-7xl">
				<p className="font-semibold text-lg">Paiement annulé</p>
				<p>
					Nous sommes désolés que vous ayez annulé le paiement. Si vous avez des
					questions, n'hésitez pas à nous contacter.
				</p>
				<Link to="/">
					<Button size="sm" className="mt-4">
						<ChevronLeftCircleIcon />
						Retour à l'accueil
					</Button>
				</Link>
			</div>
		</div>
	)
}
