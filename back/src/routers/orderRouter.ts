import { prismaClient } from "@back/utils/prisma"
import { createStripeSessionByOrder } from "@back/utils/stripe"
import { publicProcedure, router } from "@back/utils/trpc"
import { z } from "zod"

export const orderRouter = router({
	createOrder: publicProcedure
		.input(
			z
				.object({
					foodId: z.string(),
					quantity: z.number(),
				})
				.array(),
		)
		.mutation(async (opts) => {
			const orderId = crypto.randomUUID()
			const session = await createStripeSessionByOrder(orderId)
			await prismaClient.order.create({
				data: {
					id: orderId,
					stripeSessionId: session.id,
					items: {
						create: opts.input.map((food) => ({
							foodId: food.foodId,
							quantity: food.quantity,
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
				throw new Error("Order not found")
			}
			return order.items.map((item) => ({
				foodId: item.foodId,
				quantity: item.quantity,
				food: item.food,
			}))
		}),
})
