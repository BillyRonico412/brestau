import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"

export const QueryErrorBoundary = (props: {
	children: React.ReactNode
}) => {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({ resetErrorBoundary }) => (
						<div className="flex h-dvh w-dvw items-center justify-center">
							<Alert className="m-4 max-w-3xl space-y-2" variant="destructive">
								<p className="font-bold text-lg">Une erreur est survenue</p>
								<p>Veuillez vérifier votre connexion internet.</p>
								<p>Ou contacter le support.</p>
								<Button onClick={() => resetErrorBoundary()}>Réessayer</Button>
							</Alert>
						</div>
					)}
				>
					{props.children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}
