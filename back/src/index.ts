import { appRouter } from "@/routers/appRouter"
import { auth } from "@/utils/auth"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}
}>({
	strict: true,
})

app.use(logger())

app.use(
	"*",
	cors({
		origin: "http://127.0.0.1:5173", // replace with your origin
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
	}),
)

export default app
