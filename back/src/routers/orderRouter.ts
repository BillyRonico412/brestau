import { prismaClient } from "@back/utils/prisma"
import { createStripeSessionByOrder, stripe } from "@back/utils/stripe"
import { publicProcedure, router } from "@back/utils/trpc"
import { TRPCError } from "@trpc/server"
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
				include: {
					items: {
						include: {
							food: true,
						},
					},
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
			return order
		}),
})
