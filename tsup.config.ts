import {defineConfig} from "tsup";
import {cp} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

export default defineConfig({
  entry: ["index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  outDir: "dist",
  cjsInterop: true,
  target: 'node16',
  format: "esm",
  // Copy the templates files to the dist folder
  async onSuccess() {
    await cp(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "templates"),
      path.join("dist", "templates", "actions", "config", "helpers", "utils"),
      {recursive: true},
    );

    await cp(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "configs"),
      path.join("dist", "configs", "actions", "config", "helpers", "utils"),
      {recursive: true},
    );
  },
});
