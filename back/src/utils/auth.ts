import { envParsed } from "@back/utils/envParsed"
import { prismaClient } from "@back/utils/prisma"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"

export const UserType = {
	ADMIN: "admin",
	USER: "user",
	COOK: "cook",
} as const

export const auth = betterAuth({
	database: prismaAdapter(prismaClient, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	trustedOrigins: [envParsed.CORS_ORIGIN], // Add your frontend URL here
	emailAndPassword: {
		enabled: true,
		disableSignUp: false,
	},
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
		},
		defaultCookieAttributes: {
			sameSite: "None",
			secure: true,
			partitioned: true,
		},
	},
	plugins: [admin()],
	user: {
		additionalFields: {
			userType: {
				type: "string",
				required: true,
				defaultValue: UserType.USER,
			},
		},
	},
})

export type AuthType = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}
}
