import { deleteImageOnMinio, uploadFileOnMinio } from "@back/utils/file"
import { prismaClient } from "@back/utils/prisma"
import { adminProcedure, router } from "@back/utils/trpc"
import { z } from "zod"
import { zfd } from "zod-form-data"

export const foodRouter = router({
	create: adminProcedure
		.input(
			zfd.formData({
				title: zfd.text(),
				description: zfd.text(),
				image: zfd.file(),
				subCategoryId: zfd.text(),
				price: zfd.numeric(),
				estimatedTimeMn: zfd.numeric(),
				ingredientIds: zfd.repeatableOfType(zfd.text()),
			}),
		)
		.mutation(async (opts) => {
			const urlUploaded = await uploadFileOnMinio({
				file: opts.input.image,
				fileName: opts.input.title,
				directory: "food",
			})
			await prismaClient.food.create({
				data: {
					title: opts.input.title,
					description: opts.input.description,
					image: urlUploaded,
					subCategoryId: opts.input.subCategoryId,
					price: opts.input.price,
					estimatedTimeMn: opts.input.estimatedTimeMn,
					ingredients: {
						connect: opts.input.ingredientIds.map((id) => ({ id })),
					},
				},
			})
		}),
	getAll: adminProcedure.query(async () => {
		const foods = await prismaClient.food.findMany({
			include: {
				subCategory: true,
				ingredients: true,
			},
		})
		return foods
	}),
	update: adminProcedure
		.input(
			zfd.formData({
				id: zfd.text(),
				title: zfd.text(),
				description: zfd.text(),
				image: zfd.file().optional(),
				subCategoryId: zfd.text(),
				price: zfd.numeric(),
				estimatedTimeMn: zfd.numeric(),
				ingredientIds: zfd.repeatableOfType(zfd.text()),
			}),
		)
		.mutation(async (opts) => {
			let urlUploaded: string | undefined
			if (opts.input.image) {
				urlUploaded = await uploadFileOnMinio({
					file: opts.input.image,
					fileName: opts.input.title,
					directory: "food",
				})
			}
			await prismaClient.food.update({
				where: {
					id: opts.input.id,
				},
				data: {
					title: opts.input.title,
					description: opts.input.description,
					image: urlUploaded,
					subCategoryId: opts.input.subCategoryId,
					price: opts.input.price,
					estimatedTimeMn: opts.input.estimatedTimeMn,
					ingredients: {
						set: opts.input.ingredientIds.map((id) => ({ id })),
					},
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
			await prismaClient.food.delete({
				where: {
					id: opts.input.id,
				},
			})
			await deleteImageOnMinio({
				fileName: opts.input.id,
				directory: "food",
			})
		}),
})
