import { OrderItemStatusSchema } from "@back/generated/zod"
import { prismaClient } from "@back/utils/prisma"
import { createStripeSessionByOrder, stripe } from "@back/utils/stripe"
import { eventEmitter, eventNames } from "@back/utils/subscription"
import { cookProcedure, publicProcedure, router } from "@back/utils/trpc"
import { zAsyncIterable } from "@back/utils/zAsyncIterable"
import { TRPCError } from "@trpc/server"
import { on } from "events"
import { z } from "zod"

export const orderRouter = router({
	createOrder: publicProcedure
		.input(
			z
				.object({
					foodId: z.string(),
					quantity: z.number(),
					removedIngredientIds: z.array(z.string()),
				})
				.array(),
		)
		.mutation(async (opts) => {
			const orderId = crypto.randomUUID()
			const session = await createStripeSessionByOrder({
				orderId,
				foodIdAndQuantityList: opts.input,
			})
			await prismaClient.order.create({
				data: {
					id: orderId,
					stripeSessionId: session.id,
					items: {
						create: opts.input.map((food) => ({
							foodId: food.foodId,
							quantity: food.quantity,
							removedIngredients: {
								connect: food.removedIngredientIds.map((id) => ({
									id,
								})),
							},
						})),
					},
				},
			})
			eventEmitter.emit(eventNames.ORDER_UPDATED)
			return session.url
		}),

	getFoodByOrderId: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async (opts) => {
			const order = await prismaClient.order.findUnique({
				where: { id: opts.input.id },
				select: {
					stripeSessionId: true,
				},
			})
			if (!order) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Order not found",
				})
			}
			const session = await stripe.checkout.sessions.retrieve(
				order.stripeSessionId,
				{
					expand: ["payment_intent"],
				},
			)
			if (!session) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Session not found",
				})
			}
			if (session.status !== "complete") {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Payment not succeeded",
				})
			}
			const orderUpdated = await prismaClient.order.update({
				where: { id: opts.input.id },
				data: {
					status: "PAID",
				},
				include: {
					items: {
						include: {
							food: true,
						},
					},
				},
			})
			eventEmitter.emit(eventNames.ORDER_CREATED)
			eventEmitter.emit(eventNames.ORDER_UPDATED)
			return orderUpdated
		}),
	notifyUpdateOrder: publicProcedure
		.output(
			zAsyncIterable({
				yield: z.number(),
			}),
		)
		.subscription(async function* (opts) {
			for await (const _ of on(eventEmitter, eventNames.ORDER_UPDATED, {
				signal: opts.signal,
			})) {
				yield Date.now()
			}
		}),
	notifyCreateOrder: cookProcedure
		.output(
			zAsyncIterable({
				yield: z.number(),
			}),
		)
		.subscription(async function* (opts) {
			for await (const _ of on(eventEmitter, eventNames.ORDER_CREATED, {
				signal: opts.signal,
			})) {
				yield Date.now()
			}
		}),

	getOrderItems: cookProcedure.query(async () => {
		const orders = await prismaClient.order.findMany({
			where: {
				status: "PAID",
				items: {
					some: {
						status: {
							in: ["IN_PROGRESS", "PENDING", "COMPLETED"],
						},
					},
				},
			},
			orderBy: {
				counter: "asc",
			},
			include: {
				items: {
					include: {
						food: true,
						removedIngredients: true,
						cooker: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		})
		return orders
	}),
	updateOrderItemStatus: cookProcedure
		.input(
			z.object({
				orderItemId: z.string(),
				orderItemStatus: OrderItemStatusSchema,
				cookerId: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const orderItem = await prismaClient.orderItem.update({
				where: {
					id: opts.input.orderItemId,
				},
				data: {
					status: opts.input.orderItemStatus,
					cookerId: opts.input.cookerId,
				},
				select: {
					order: {
						select: {
							items: {
								select: {
									status: true,
								},
							},
						},
					},
				},
			})
			if (orderItem.order.items.every((item) => item.status === "COMPLETED")) {
				eventEmitter.emit(eventNames.ORDER_READY_TO_COMPLETED)
			}
			if (!orderItem) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Order item not found",
				})
			}
			eventEmitter.emit(eventNames.ORDER_UPDATED)
			return orderItem
		}),
	notifyOrderReadyToCompleted: cookProcedure
		.output(
			zAsyncIterable({
				yield: z.number(),
			}),
		)
		.subscription(async function* (opts) {
			for await (const _ of on(
				eventEmitter,
				eventNames.ORDER_READY_TO_COMPLETED,
				{
					signal: opts.signal,
				},
			)) {
				yield Date.now()
			}
		}),
	getOrderClientInfos: publicProcedure.query(async () => {
		const orders = await prismaClient.order.findMany({
			where: {
				status: "PAID",
			},
			include: {
				items: {
					select: {
						status: true,
					},
				},
			},
		})
		const pendingCounters: number[] = []
		const inProgressCounters: number[] = []
		const completedCounters: number[] = []

		for (const order of orders) {
			if (order.items.every((item) => item.status === "PENDING")) {
				pendingCounters.push(order.counter)
				continue
			}
			if (order.items.every((item) => item.status === "COMPLETED")) {
				completedCounters.push(order.counter)
				continue
			}
			inProgressCounters.push(order.counter)
		}

		return { pendingCounters, inProgressCounters, completedCounters }
	}),
	completeOrder: cookProcedure
		.input(
			z.object({
				orderId: z.string(),
				serverId: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const order = await prismaClient.order.update({
				where: {
					id: opts.input.orderId,
				},
				data: {
					status: "COMPLETED",
					serverId: opts.input.serverId,
				},
			})
			if (!order) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Order not found",
				})
			}
			eventEmitter.emit(eventNames.ORDER_UPDATED)
			return order
		}),
})
