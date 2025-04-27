import { categoryRouter } from "@back/routers/categoryRouter"
import { foodRouter } from "@back/routers/foodRouter"
import { ingredientRouter } from "@back/routers/ingredientRouter"
import { orderRouter } from "@back/routers/orderRouter"
import { subCategoryRouter } from "@back/routers/subCategoryRouter"
import { router } from "@back/utils/trpc"

export const appRouter = router({
	category: categoryRouter,
	subCategory: subCategoryRouter,
	food: foodRouter,
	ingredient: ingredientRouter,
	order: orderRouter,
})
