import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // El cerebro es logica pura: no necesita navegador.
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
