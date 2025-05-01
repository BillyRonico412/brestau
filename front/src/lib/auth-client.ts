import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@back/utils/auth"

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BACK_URL,
	plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
})
