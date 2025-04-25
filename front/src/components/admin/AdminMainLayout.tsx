import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary"
import { QuerySuspense } from "@/components/common/QuerySuspense"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export const AdminMain = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<QueryErrorBoundary>
			<QuerySuspense>
				<div
					{...props}
					className={cn(
						"flex h-full w-full flex-col overflow-hidden",
						props.className,
					)}
				>
					{props.children}
				</div>
			</QuerySuspense>
		</QueryErrorBoundary>
	)
}

export const AdminHeader = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			{...props}
			className={cn(
				"mx-auto w-full max-w-7xl shrink-0 px-4 py-2",
				props.className,
			)}
		>
			{props.children}
		</div>
	)
}

export const AdminBody = (props: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className="flex-1 overflow-y-auto">
			<div
				{...props}
				className={cn("mx-auto w-full max-w-7xl px-4 py-2", props.className)}
			>
				{props.children}
			</div>
		</div>
	)
}
