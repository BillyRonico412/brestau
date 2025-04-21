import { type auth, UserType } from "@back/utils/auth"
import { initTRPC, TRPCError } from "@trpc/server"

const t = initTRPC
	.context<{
		user: typeof auth.$Infer.Session.user | null
		session: typeof auth.$Infer.Session.session | null
	}>()
	.create()

export const router = t.router
export const publicProcedure = t.procedure

export const adminProcedure = t.procedure.use((opts) => {
	if (!opts.ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		})
	}
	if (opts.ctx.user?.userType !== UserType.ADMIN) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You do not have permission to access this resource.",
		})
	}
	return opts.next({
		ctx: {
			user: opts.ctx.user,
			session: opts.ctx.session,
		},
	})
})

export const cookProcedure = t.procedure.use((opts) => {
	if (!opts.ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		})
	}
	if (opts.ctx.user?.userType !== UserType.COOK) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You do not have permission to access this resource.",
		})
	}
	return opts.next({
		ctx: {
			user: opts.ctx.user,
			session: opts.ctx.session,
		},
	})
})
