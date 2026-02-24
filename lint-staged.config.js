/** @type {import('lint-staged').Configuration} */
export default {
  "src/**/*.{ts,tsx,js}": (files) => {
    const targets = files.filter((file) => !/\.test\.(?:ts|tsx|js)$/.test(file));
    return targets.length === 0 ? [] : `eslint ${targets.join(' ')}`;
  }
}