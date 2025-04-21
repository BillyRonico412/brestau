import { prismaClient } from "@back/utils/prisma"
import { adminProcedure, router } from "@back/utils/trpc"
import { z } from "zod"

export const ingredientRouter = router({
	create: adminProcedure
		.input(
			z.object({
				title: z.string(),
				vegetarian: z.boolean(),
				halal: z.boolean(),
				noGluten: z.boolean(),
				noLactose: z.boolean(),
			}),
		)
		.mutation(async (opts) => {
			return await prismaClient.ingredient.create({
				data: opts.input,
			})
		}),
	getAll: adminProcedure.query(async () => {
		const ingredients = await prismaClient.ingredient.findMany()
		return ingredients
	}),
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
				vegetarian: z.boolean().optional(),
				halal: z.boolean().optional(),
				noGluten: z.boolean().optional(),
				noLactose: z.boolean().optional(),
			}),
		)
		.mutation(async (opts) => {
			await prismaClient.ingredient.update({
				where: {
					id: opts.input.id,
				},
				data: opts.input,
			})
		}),
	delete: adminProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async (opts) => {
			await prismaClient.ingredient.delete({
				where: {
					id: opts.input.id,
				},
			})
		}),
})
