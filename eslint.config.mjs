import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		rules: {
			"indent": ["error", "tab", { 
				"SwitchCase": 1, 
			}],
			"no-mixed-spaces-and-tabs": "error",
			"quotes": ["error", "double"],
			"semi": ["error", "always"],
			"comma-dangle": ["error", "always-multiline"],
		},
	},
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
]);

export default eslintConfig;