import fs from "node:fs";
import * as esbuild from 'esbuild';

const ESM = true;
const CJS = true;
const BROWSER = true;
const BROWSER_GLOBAL_NAME = "shitJs";

const ENTRY_POINT = "./src/shit.ts";
const FILENAME = "shit";

const ESM_OUTPUT_PATH = `./dist/${FILENAME}.mjs`;
const ESM_MIN_OUTPUT_PATH = `./dist/${FILENAME}.min.mjs`;
const CJS_OUTPUT_PATH = `./dist/${FILENAME}.cjs`;
const CJS_MIN_OUTPUT_PATH = `./dist/${FILENAME}.min.cjs`;
const BROWSER_OUTPUT_PATH = `./dist/${FILENAME}.js`;
const BROWSER_MIN_OUTPUT_PATH = `./dist/${FILENAME}.min.js`;
const TYPE_OUTPUT_PATH = `./dist/types/${FILENAME}.d.ts`;

/** @see https://esbuild.github.io/api/#external */
const externalPackages = [];

const options = [];
if (ESM) {
  options.push(
    {
      entryPoints: [ENTRY_POINT],
      platform: "node",
      format: 'esm',
      bundle: true,
      outfile: ESM_OUTPUT_PATH,
      external: externalPackages,
    },
    {
      entryPoints: [ENTRY_POINT],
      platform: "node",
      format: 'esm',
      bundle: true,
      minify: true,
      outfile: ESM_MIN_OUTPUT_PATH,
      external: externalPackages,
    },
  );
}

if (CJS) {
  options.push(
    {
      entryPoints: [ENTRY_POINT],
      platform: "node",
      format: 'cjs',
      bundle: true,
      outfile: CJS_OUTPUT_PATH,
      external: externalPackages,
    },
    {
      entryPoints: [ENTRY_POINT],
      platform: "node",
      format: 'cjs',
      bundle: true,
      minify: true,
      outfile: CJS_MIN_OUTPUT_PATH,
      external: externalPackages,
    },
  );
}

if (BROWSER) {
  options.push(
    {
      entryPoints: [ENTRY_POINT],
      platform: "browser",
      format: "iife",
      globalName: BROWSER_GLOBAL_NAME,
      bundle: true,
      outfile: BROWSER_OUTPUT_PATH,
      external: externalPackages,
    },
    {
      entryPoints: [ENTRY_POINT],
      platform: "browser",
      format: "iife",
      globalName: BROWSER_GLOBAL_NAME,
      bundle: true,
      minify: true,
      outfile: BROWSER_MIN_OUTPUT_PATH,
      external: externalPackages,
    },
  );
}

// Clear
if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}

// Build
for (const option of options) {
  await esbuild.build(option);
}