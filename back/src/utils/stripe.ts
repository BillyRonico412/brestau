import { envParsed } from "@back/utils/envParsed"
import { prismaClient } from "@back/utils/prisma"
import Stripe from "stripe"

export const stripe = new Stripe(envParsed.STRIPE_SECRET_KEY)

export const createStripeSessionByOrder = async (params: {
	orderId: string
	foodIdAndQuantityList: {
		foodId: string
		quantity: number
	}[]
}) => {
	let total = 0
	const foodPrices = await prismaClient.food.findMany({
		where: {
			id: {
				in: params.foodIdAndQuantityList.map((food) => food.foodId),
			},
		},
		select: {
			id: true,
			price: true,
		},
	})
	const foodPricesById = Object.fromEntries(
		foodPrices.map((food) => [food.id, food.price]),
	)
	for (const foodIdAndQuantity of params.foodIdAndQuantityList) {
		const quantity = foodIdAndQuantity.quantity
		total += foodPricesById[foodIdAndQuantity.foodId] * quantity
	}
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: "eur",
					product_data: {
						name: "Panier de commande Brestau",
						metadata: {
							orderId: params.orderId,
						},
					},
					unit_amount: Math.round(total * 100),
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${envParsed.CORS_ORIGIN}/payment/success?orderId=${params.orderId}`,
		cancel_url: `${envParsed.CORS_ORIGIN}/payment/cancel`,
	})
	return {
		id: session.id,
		url: session.url,
	}
}
