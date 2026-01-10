import path from "node:path";
import fs from "node:fs";
import * as esbuild from 'esbuild';

const pkg = JSON.parse(fs.readFileSync("./package.json"));

const options = {
  esm: true,
  cjs: true,
  browser: true,
  globalName: "shitJs",
  entryPoint: "./src/shit.ts",
}

const filename = path.basename(options.entryPoint, path.extname(options.entryPoint));

const paths = {
  esm: `./dist/${filename}.mjs`,
  esmMin: `./dist/${filename}.min.mjs`,
  cjs: `./dist/${filename}.cjs`,
  cjsMin: `./dist/${filename}.min.cjs`,
  browser: `./dist/${filename}.js`,
  browserMin: `./dist/${filename}.min.js`,
  type: `./dist/types/${filename}.d.ts`,
}

const isPackageChanged = pkg["main"] !== paths.esmMin ||
  pkg["module"] !== paths.esmMin ||
  pkg["types"] !== paths.type ||
  pkg["exports"]["."]["types"] !== paths.type ||
  pkg["exports"]["."]["import"] !== paths.esmMin ||
  pkg["exports"]["."]["require"] !== paths.cjsMin;
  
/** @see https://esbuild.github.io/api/#external */
const externalPackages = [];

/** @type {import("esbuild").BuildOptions[]} */
const buildOptions = [];

if (options.esm) {
  buildOptions.push(
    {
      entryPoints: [options.entryPoint],
      platform: "node",
      format: 'esm',
      bundle: true,
      outfile: paths.esm,
      external: externalPackages,
    },
    {
      entryPoints: [options.entryPoint],
      platform: "node",
      format: 'esm',
      bundle: true,
      minify: true,
      outfile: paths.esmMin,
      external: externalPackages,
    },
  );
}

if (options.cjs) {
  buildOptions.push(
    {
      entryPoints: [options.entryPoint],
      platform: "node",
      format: 'cjs',
      bundle: true,
      outfile: paths.cjs,
      external: externalPackages,
    },
    {
      entryPoints: [options.entryPoint],
      platform: "node",
      format: 'cjs',
      bundle: true,
      minify: true,
      outfile: paths.cjsMin,
      external: externalPackages,
    },
  );
}

if (options.browser) {
  buildOptions.push(
    {
      entryPoints: [options.entryPoint],
      platform: "browser",
      format: "iife",
      globalName: options.globalName,
      bundle: true,
      outfile: paths.browser,
      external: externalPackages,
    },
    {
      entryPoints: [options.entryPoint],
      platform: "browser",
      format: "iife",
      globalName: options.globalName,
      bundle: true,
      minify: true,
      outfile: paths.browserMin,
      external: externalPackages,
    },
  );
}

// Clear dist directory
if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}

// Create script files
for (const option of buildOptions) {
  await esbuild.build(option);
}

// Update package.json
if (isPackageChanged) {
  pkg["main"] = paths.esmMin;
  pkg["module"] = paths.esmMin;
  pkg["types"] = paths.type;
  pkg["exports"]["."]["types"] = paths.type;
  pkg["exports"]["."]["import"] = paths.esmMin;
  pkg["exports"]["."]["require"] = paths.cjsMin;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2), "utf8");
}