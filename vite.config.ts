/// <reference types="vitest/config" />

import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ autoCodeSplitting: true }),
		tailwindcss(),
		react(),
	],
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./test.setup.ts"],
		coverage: {
			enabled: true,
			reporter: "text",
		},
	},
});
