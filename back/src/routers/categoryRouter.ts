import { prismaClient } from "@back/utils/prisma"
import { router, adminProcedure, publicProcedure } from "@back/utils/trpc"
import { z } from "zod"

export const categoryRouter = router({
	create: adminProcedure
		.input(
			z.object({
				title: z.string(),
			}),
		)
		.mutation(async (opts) => {
			return await prismaClient.category.create({
				data: {
					title: opts.input.title,
				},
			})
		}),
	getAll: publicProcedure.query(async () => {
		const categories = await prismaClient.category.findMany({
			include: {
				subCategories: {
					select: {
						_count: true,
					},
				},
			},
		})
		return categories.map((category) => ({
			...category,
			subCategoriesCount: category.subCategories.length,
			foodsCount: category.subCategories.reduce(
				(acc, subCategory) => acc + subCategory._count.foods,
				0,
			),
		}))
	}),
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string(),
			}),
		)
		.mutation(async (opts) => {
			await prismaClient.category.update({
				where: {
					id: opts.input.id,
				},
				data: {
					title: opts.input.title,
				},
			})
		}),
	delete: adminProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async (opts) => {
			await prismaClient.category.delete({
				where: {
					id: opts.input.id,
				},
			})
		}),
	getAllForClient: publicProcedure.query(async () => {
		const categories = await prismaClient.category.findMany({
			include: {
				subCategories: {
					include: {
						foods: {
							include: {
								ingredients: true,
							},
						},
					},
				},
			},
		})
		return categories
	}),
})
