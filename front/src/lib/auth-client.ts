import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const authClient = createAuthClient({
	baseURL: "http://127.0.0.1:3000",
})
