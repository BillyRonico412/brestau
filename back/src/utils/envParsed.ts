import { z } from "zod"

export const envParsed = z
	.object({
		SUPER_ADMIN_MAIL_BILLY: z.string().email(),
		SUPER_ADMIN_MAIL_RACHEL: z.string().email(),
		SUPER_ADMIN_PASSWORD_BILLY: z.string(),
		SUPER_ADMIN_PASSWORD_RACHEL: z.string(),
		CORS_ORIGIN: z.string().url(),
		MINIO_ENDPOINT: z.string(),
		MINIO_ACCESS_KEY: z.string(),
		MINIO_SECRET_KEY: z.string(),
		MINIO_BUCKET: z.string(),
	})
	// biome-ignore lint/nursery/noProcessEnv: <explanation>
	.parse(process.env)
