import { Suspense } from "react"

export const QuerySuspense = (props: { children: React.ReactNode }) => {
	return (
		<Suspense
			fallback={
				<div className="flex h-full w-full animate-pulse items-center justify-center font-black text-2xl">
					Chargement...
				</div>
			}
		>
			{props.children}
		</Suspense>
	)
}
