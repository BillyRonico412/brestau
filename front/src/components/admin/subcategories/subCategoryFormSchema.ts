import { z } from "zod"

export const subCategoryFormSchema = z.object({
	title: z.string().nonempty("Le titre est requis."),
	image: z
		.instanceof(File, {
			message: "Le fichier doit être une image.",
		})
		.refine((file) => file.size < 5 * 1024 * 1024, {
			message: "L'image doit faire moins de 5 Mo.",
		}),
	categoryId: z.string().nonempty("La catégorie est requise."),
})
