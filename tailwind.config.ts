import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#00DAF3",
				secondary: "#E9C349",
				tertiary: "#16100b",
				neutral: "#111317",
				headline: "#E2E2E8",
				body: "#C6C6CB",
				label: "#C6C6CB",
			},
			fontFamily: {
				sans: ["Manrope", "sans-serif"],
			},
		},
	},
	plugins: [],
} satisfies Config;