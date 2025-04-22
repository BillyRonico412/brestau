import { z } from "zod"

export const envParsed = z
	.object({
		VITE_BACK_URL: z.string(),
	})
	.parse(import.meta.env)
