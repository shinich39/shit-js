import fs from "node:fs";
import path from "node:path";
import * as esbuild from 'esbuild';

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const ESM = true;
const CJS = true;
const BROWSER = true;

const ENTRY_POINT = "./src/shit.ts";
const OUTPUT_FILENAME = path.basename(ENTRY_POINT, path.extname(ENTRY_POINT));
const BROWSER_GLOBAL_NAME = "ShitJs";

const ESM_OUTPUT_PATH = `./dist/${OUTPUT_FILENAME}.mjs`;
const ESM_MIN_OUTPUT_PATH = `./dist/${OUTPUT_FILENAME}.min.mjs`;
const CJS_OUTPUT_PATH = `./dist/${OUTPUT_FILENAME}.cjs`;
const CJS_MIN_OUTPUT_PATH = `./dist/${OUTPUT_FILENAME}.min.cjs`;
const BROWSER_OUTPUT_PATH = `./dist/${OUTPUT_FILENAME}.js`;
const BROWSER_MIN_OUTPUT_PATH = `./dist/${OUTPUT_FILENAME}.min.js`;
const TYPE_OUTPUT_PATH = `./dist/types/${OUTPUT_FILENAME}.d.ts`;

// https://esbuild.github.io/api/#external
const externalPackages = [];

// https://esbuild.github.io/api/#packages
const bundleExternalPackages = true;

const options = [];
if (ESM) {
  options.push(
    {
      entryPoints: [ENTRY_POINT],
      platform: BROWSER ? "browser" : "node",
      format: 'esm',
      bundle: true,
      outfile: ESM_OUTPUT_PATH,
      external: externalPackages,
      ...(bundleExternalPackages ? {} : { packages: "external" }),
    },
    {
      entryPoints: [ENTRY_POINT],
      platform: BROWSER ? "browser" : "node",
      format: 'esm',
      bundle: true,
      minify: true,
      outfile: ESM_MIN_OUTPUT_PATH,
      external: externalPackages,
      ...(bundleExternalPackages ? {} : { packages: "external" }),
    },
  );
}

if (CJS) {
  options.push(
    {
      entryPoints: [ENTRY_POINT],
      platform: BROWSER ? "browser" : "node",
      format: 'cjs',
      bundle: true,
      outfile: CJS_OUTPUT_PATH,
      external: externalPackages,
      ...(bundleExternalPackages ? {} : { packages: "external" }),
    },
    {
      entryPoints: [ENTRY_POINT],
      platform: BROWSER ? "browser" : "node",
      format: 'cjs',
      bundle: true,
      minify: true,
      outfile: CJS_MIN_OUTPUT_PATH,
      external: externalPackages,
      ...(bundleExternalPackages ? {} : { packages: "external" }),
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

// Update package.json
if (pkg["main"] !== ESM_MIN_OUTPUT_PATH) {
  pkg["main"] = ESM_MIN_OUTPUT_PATH;
  pkg["types"] = TYPE_OUTPUT_PATH;
  pkg["exports"]["."]["types"] = TYPE_OUTPUT_PATH;
  pkg["exports"]["."]["import"] = ESM_MIN_OUTPUT_PATH;
  pkg["exports"]["."]["require"] = CJS_MIN_OUTPUT_PATH;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2), "utf8");
  console.log("package.json has been updated.");
}