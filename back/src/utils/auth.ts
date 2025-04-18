import { prismaClient } from "@/utils/prisma"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
	database: prismaAdapter(prismaClient, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	trustedOrigins: ["http://127.0.0.1:5173"], // Add your frontend URL here
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
	},
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
		},
	},
})

export type AuthType = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}
}
