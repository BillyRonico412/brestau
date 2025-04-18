import { auth } from "@/utils/auth"
import { envParsed } from "@/utils/envParsed"
;(async () => {
	await auth.api.signUpEmail({
		body: {
			name: "BILLY Ronico",
			email: envParsed.SUPER_ADMIN_MAIL_BILLY,
			password: envParsed.SUPER_ADMIN_PASSWORD_BILLY,
		},
	})

	await auth.api.signUpEmail({
		body: {
			name: "BASTIE Rachel",
			email: envParsed.SUPER_ADMIN_MAIL_RACHEL,
			password: envParsed.SUPER_ADMIN_PASSWORD_RACHEL,
		},
	})
})()
