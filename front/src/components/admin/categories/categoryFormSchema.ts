import { z } from "zod"

export const categoryFormSchema = z.object({
	title: z
		.string()
		.min(3, {
			message: "Le titre doit contenir au moins 3 caractères",
		})
		.max(50, {
			message: "Le titre doit contenir au maximum 50 caractères",
		}),
})
