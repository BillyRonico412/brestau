import { z } from "zod"

export const envParsed = z
	.object({
		SUPER_ADMIN_MAIL_BILLY: z.string().email(),
		SUPER_ADMIN_MAIL_RACHEL: z.string().email(),
		SUPER_ADMIN_PASSWORD_BILLY: z.string(),
		SUPER_ADMIN_PASSWORD_RACHEL: z.string(),
	})
	// biome-ignore lint/nursery/noProcessEnv: <explanation>
	.parse(process.env)
