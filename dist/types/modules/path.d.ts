/**
 * @example
 * const result = joinPaths("./project/", "abc", "./package.json");
 * // "project/abc/package.json"
 */
export declare function joinPaths(...args: string[]): string;
/**
 * @example
 * const result = getBaseName("./project/package.json");
 * // "package.json"
 *
 * const result = getBaseName("./project/package.json", ".json");
 * // "package"
 */
export declare function getBaseName(str: string, suffix?: string): string;
/**
 * @example
 * const result = getExtName("./project/package.json");
 * // ".json"
 */
export declare function getExtName(str: string): string;
/**
 * @example
 * const result = getDirName("./project/package.json");
 * // "./project"
 */
export declare function getDirName(str: string): string;
/**
 * @example
 * const result = getRelativePath("./project/", "./package.json");
 * // "../package.json"
 */
export declare function getRelativePath(from: string, to: string): string;
/**
 * @example
 * const result = getRootPath(
 *   "./project/abc/package.json",
 *   "./project/abc/def",
 *   "./project/abc/def/package.json",
 *   "./project/abc/def/ghi/package.json",
 *   "./project/abc/ghi/package.json",
 *   "project/abc/def/ghi/package.json",
 * );
 * // "project/abc"
 */
export declare function getRootPath(...args: string[]): string;
//# sourceMappingURL=path.d.ts.map