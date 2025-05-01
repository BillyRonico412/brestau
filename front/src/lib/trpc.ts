import { envParsed } from "@/lib/envParsed"
import { QueryClient } from "@tanstack/react-query"
import {
	createTRPCClient,
	httpBatchLink,
	httpLink,
	httpSubscriptionLink,
	loggerLink,
	splitLink,
} from "@trpc/client"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import type { AppRouter } from "../../../back/src/export"

export const queryClient = new QueryClient()

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		loggerLink(),
		splitLink({
			condition: (op) => op.input instanceof FormData,
			true: httpLink({
				url: `${envParsed.VITE_BACK_URL}/trpc`,
				fetch: (input, init) =>
					fetch(input, {
						...init,
						credentials: "include",
					}),
			}),
			false: splitLink({
				condition: (op) => op.type === "subscription",
				true: httpSubscriptionLink({
					url: `${envParsed.VITE_BACK_URL}/trpc`,
					eventSourceOptions() {
						return {
							withCredentials: true,
						}
					},
				}),
				false: httpBatchLink({
					url: `${envParsed.VITE_BACK_URL}/trpc`,
					fetch: (input, init) =>
						fetch(input, {
							...init,
							credentials: "include",
						}),
				}),
			}),
		}),
	],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
})

export type Inputs = inferRouterInputs<AppRouter>
export type Outputs = inferRouterOutputs<AppRouter>
