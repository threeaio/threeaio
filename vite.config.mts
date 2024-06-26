import {defineConfig} from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [solidPlugin(), devtools(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
