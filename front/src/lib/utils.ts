import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const toCurrency = (value: number) => {
	return value.toLocaleString("fr-FR", {
		style: "currency",
		currency: "EUR",
	})
}
