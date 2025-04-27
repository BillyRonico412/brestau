import { z } from "zod"
import { config } from "dotenv"

config()

export const envParsed = z
	.object({
		SUPER_ADMIN_MAIL_BILLY: z.string(),
		SUPER_ADMIN_MAIL_RACHEL: z.string(),
		SUPER_ADMIN_PASSWORD_BILLY: z.string(),
		SUPER_ADMIN_PASSWORD_RACHEL: z.string(),
		CORS_ORIGIN: z.string(),
		MINIO_ENDPOINT: z.string(),
		MINIO_ACCESS_KEY: z.string(),
		MINIO_SECRET_KEY: z.string(),
		MINIO_BUCKET: z.string(),
		STRIPE_SECRET_KEY: z.string(),
	})
	// biome-ignore lint/nursery/noProcessEnv: <explanation>
	.parse(process.env)
