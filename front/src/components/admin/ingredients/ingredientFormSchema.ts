import { z } from "zod"

export const ingredientFormSchema = z.object({
	title: z.string().nonempty("Le titre est requis."),
	vegetarian: z.boolean(),
	halal: z.boolean(),
	noGluten: z.boolean(),
	noLactose: z.boolean(),
})
