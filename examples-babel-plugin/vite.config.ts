import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        // Use our babel config which includes the auto-testid plugin
        configFile: "./babel.config.cjs",
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
