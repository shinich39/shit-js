import fs from "node:fs";
import * as esbuild from 'esbuild';

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const ESM = true;
const CJS = true;
const BROWSER = true;
const BROWSER_GLOBAL_NAME = "shit";
const entryPoints = ["./src/index.ts"];
// https://esbuild.github.io/api/#external
const externalPackages = [];
// https://esbuild.github.io/api/#packages
const bundlePackages = true;

const options = [];
if (ESM) {
  options.push(
    {
      entryPoints: entryPoints,
      platform: BROWSER ? "browser" : "node",
      format: 'esm',
      bundle: true,
      outfile: `./dist/index.mjs`,
      external: externalPackages,
      ...(bundlePackages ? {} : { packages: "external" }),
    },
    {
      entryPoints: entryPoints,
      platform: BROWSER ? "browser" : "node",
      format: 'esm',
      bundle: true,
      minify: true,
      outfile: `./dist/index.min.mjs`,
      external: externalPackages,
      ...(bundlePackages ? {} : { packages: "external" }),
    },
  );
}
if (CJS) {
  options.push(
    {
      entryPoints: entryPoints,
      platform: BROWSER ? "browser" : "node",
      format: 'cjs',
      bundle: true,
      outfile: `./dist/index.cjs`,
      external: externalPackages,
      ...(bundlePackages ? {} : { packages: "external" }),
    },
    {
      entryPoints: entryPoints,
      platform: BROWSER ? "browser" : "node",
      format: 'cjs',
      bundle: true,
      minify: true,
      outfile: `./dist/index.min.cjs`,
      external: externalPackages,
      ...(bundlePackages ? {} : { packages: "external" }),
    },
  );
}
if (BROWSER) {
  options.push(
    {
      entryPoints: entryPoints,
      platform: "browser",
      format: "iife",
      globalName: BROWSER_GLOBAL_NAME,
      bundle: true,
      outfile: `./dist/index.js`,
      external: externalPackages,
    },
    {
      entryPoints: entryPoints,
      platform: "browser",
      format: "iife",
      globalName: BROWSER_GLOBAL_NAME,
      bundle: true,
      minify: true,
      outfile: `./dist/index.min.js`,
      external: externalPackages,
    },
  );
}

// clear
if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}

// build
for (const option of options) {
  await esbuild.build(option);
}