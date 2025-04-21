import { z } from "zod"

export const foodFormSchema = z.object({
	title: z.string().nonempty("Le titre est requis."),
	description: z.string().nonempty("La description est requise."),
	image: z
		.instanceof(File, {
			message: "Le fichier doit être une image.",
		})
		.refine((file) => file.size < 5 * 1024 * 1024, {
			message: "L'image doit faire moins de 5 Mo.",
		}),
	price: z.number().positive("Le prix doit être un nombre positif."),
	subCategoryId: z.string().nonempty("La sous-catégorie est requise."),
	estimatedTimeMn: z
		.number()
		.int("Le temps estimé doit être un entier.")
		.positive("Le temps estimé doit être un nombre positif."),
	ingredientIds: z
		.array(z.string())
		.nonempty("Au moins un ingrédient est requis."),
})
