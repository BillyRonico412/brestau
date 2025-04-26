import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlertIcon } from "lucide-react"
import type { HTMLAttributes } from "react"

export const SelectionHeader = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className="px-4 py-2 text-center font-semibold text-xl">
			{props.children}
		</div>
	)
}

export const SelectionEmptyState = (
	props: HTMLAttributes<HTMLDivElement> & {
		title: string
		description: string
	},
) => {
	return (
		<Alert>
			<CircleAlertIcon className="h-4 w-4" />
			<AlertTitle>{props.title}</AlertTitle>
			<AlertDescription>{props.description}</AlertDescription>
		</Alert>
	)
}

export const SelectionBody = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className="items-center-safe flex flex-1 overflow-y-auto px-4 py-2">
			{props.children}
		</div>
	)
}

export const SelectionLayout = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className="flex h-dvh w-dvw py-12">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-y-4 overflow-hidden">
				{props.children}
			</div>
		</div>
	)
}
