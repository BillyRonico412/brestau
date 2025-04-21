import { deleteImageOnMinio, uploadFileOnMinio } from "@back/utils/file"
import { prismaClient } from "@back/utils/prisma"
import { adminProcedure, router } from "@back/utils/trpc"
import { z } from "zod"
import { zfd } from "zod-form-data"

export const subCategoryRouter = router({
	create: adminProcedure
		.input(
			zfd.formData({
				title: zfd.text(),
				image: zfd.file(),
				categoryId: zfd.text(),
			}),
		)
		.mutation(async (opts) => {
			const urlUploaded = await uploadFileOnMinio({
				file: opts.input.image,
				fileName: opts.input.title,
				directory: "subCategory",
			})
			return await prismaClient.subCategory.create({
				data: {
					title: opts.input.title,
					image: urlUploaded,
					categoryId: opts.input.categoryId,
				},
			})
		}),
	getAll: adminProcedure.query(async () => {
		const subCategories = await prismaClient.subCategory.findMany({
			include: {
				category: true,
				_count: true,
			},
		})
		return subCategories.map((subCategory) => ({
			...subCategory,
			foodsCount: subCategory._count.foods,
		}))
	}),
	update: adminProcedure
		.input(
			zfd.formData({
				id: zfd.text(),
				title: zfd.text(),
				image: zfd.file().optional(),
				categoryId: zfd.text(),
			}),
		)
		.mutation(async (opts) => {
			let urlUploaded: string | undefined
			if (opts.input.image) {
				urlUploaded = await uploadFileOnMinio({
					file: opts.input.image,
					fileName: opts.input.title,
					directory: "subCategory",
				})
			}
			await prismaClient.subCategory.update({
				where: {
					id: opts.input.id,
				},
				data: {
					title: opts.input.title,
					image: urlUploaded,
					categoryId: opts.input.categoryId,
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
			await prismaClient.subCategory.delete({
				where: {
					id: opts.input.id,
				},
			})
			await deleteImageOnMinio({
				fileName: opts.input.id,
				directory: "subCategory",
			})
		}),
})
