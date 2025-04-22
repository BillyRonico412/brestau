import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { appRouter } from "@back/routers/appRouter"
import { auth } from "@back/utils/auth"
import { envParsed } from "@back/utils/envParsed"
import { serve } from "@hono/node-server"

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}
}>({
	strict: true,
})

app.use(logger())

app.get("/hello", (c) => {
	return c.text("Hello world!", 200)
})

app.use(
	"*",
	cors({
		origin: envParsed.CORS_ORIGIN,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
)

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers })
	if (!session) {
		c.set("user", null)
		c.set("session", null)
		return next()
	}
	c.set("user", session.user)
	c.set("session", session.session)
	return next()
})

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw)
})

app.get("/session", async (c) => {
	const session = c.get("session")
	const user = c.get("user")

	if (!user) {
		return c.body(null, 401)
	}

	return c.json({
		session,
		user,
	})
})

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext(_, c) {
			const user = c.get("user")
			const session = c.get("session")
			return {
				user,
				session,
			}
		},
	}),
)

serve(
	{
		port: 4000,
		fetch: app.fetch,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`)
	},
)
