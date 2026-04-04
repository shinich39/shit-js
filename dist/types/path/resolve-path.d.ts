/**
 * @example
 * resolvePath("./project/", "abc", "./package.json"); // "project/abc/package.json"
 * resolvePath("/project/", "abc");       // "/project/abc"
 * resolvePath("/project/", "../abc");    // "/abc"
 * resolvePath("/project/", "..", "..");  // "/"
 * resolvePath("project/", "..");         // ""
 */
export declare function resolvePath(...args: string[]): string;
//# sourceMappingURL=resolve-path.d.ts.map