import { z } from "zod"

export const envParsed = z
	.object({
		SUPER_ADMIN_MAIL_BILLY: z.string().email(),
		SUPER_ADMIN_MAIL_RACHEL: z.string().email(),
	})
	// biome-ignore lint/nursery/noProcessEnv: <explanation>
	.parse(process.env)
