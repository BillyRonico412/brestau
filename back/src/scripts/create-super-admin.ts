import { auth } from "@back/utils/auth"
import { envParsed } from "@back/utils/envParsed"
;(async () => {
	await auth.api.signUpEmail({
		body: {
			name: "BILLY Ronico",
			email: envParsed.SUPER_ADMIN_MAIL_BILLY,
			password: envParsed.SUPER_ADMIN_PASSWORD_BILLY,
			userType: "admin",
		},
	})

	await auth.api.signUpEmail({
		body: {
			name: "BASTIE Rachel",
			email: envParsed.SUPER_ADMIN_MAIL_RACHEL,
			password: envParsed.SUPER_ADMIN_PASSWORD_RACHEL,
			userType: "admin",
		},
	})
})()
