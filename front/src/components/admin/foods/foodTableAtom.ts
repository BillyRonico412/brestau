import type { ReactTable } from "@/components/common/DataTable"
import type { Outputs } from "@/lib/trpc"
import { atom } from "jotai"

export type Food = Outputs["food"]["getAll"][number]

export const foodTableAtom = atom<ReactTable<Food> | undefined>(undefined)
