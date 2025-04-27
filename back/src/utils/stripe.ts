import { envParsed } from "@back/utils/envParsed"
import { prismaClient } from "@back/utils/prisma"
import Stripe from "stripe"

export const stripe = new Stripe(envParsed.STRIPE_SECRET_KEY)

export const createStripeSessionByOrder = async (orderId: string) => {
	const order = await prismaClient.order.findUnique({
		where: { id: orderId },
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
	let total = 0
	for (const orderItem of order.items) {
		const quantity = orderItem.quantity
		total += orderItem.food.price * quantity
	}
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: "eur",
					product_data: {
						name: "Panier de commande Brestau",
						metadata: {
							orderId: order.id,
						},
					},
					unit_amount: Math.round(total * 100),
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${envParsed.CORS_ORIGIN}/payment/success?orderId=${order.id}`,
		cancel_url: `${envParsed.CORS_ORIGIN}/payment/cancel`,
	})
	return {
		id: session.id,
		url: session.url,
	}
}
