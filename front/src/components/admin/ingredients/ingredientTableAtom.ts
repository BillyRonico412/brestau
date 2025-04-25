import type { ReactTable } from "@/components/common/DataTable"
import type { Outputs } from "@/lib/trpc"
import { atom } from "jotai"

export type Ingredient = Outputs["ingredient"]["getAll"][number]

export const ingredientTableAtom = atom<ReactTable<Ingredient> | undefined>(
	undefined,
)
