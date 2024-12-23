/// <reference types="vitest" />

import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  // https://github.com/remix-run/remix/issues/8982#issuecomment-2064382496
  plugins: [
    process.env.NODE_ENV === "test" ? null : reactRouter(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    watch: false,
    include: ["./tests/*.test.{ts,tsx}"],
  },
});
