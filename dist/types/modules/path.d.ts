/**
 * @example
 * joinPaths("./project/", "abc", "./package.json"); // "project/abc/package.json"
 */
export declare function joinPaths(...args: string[]): string;
/**
 * @example
 * getBasename("./project/package.json"); // "package.json"
 * getBasename("./project/package.json", ".json"); // "package"
 */
export declare function getBasename(str: string, suffix?: string): string;
/**
 * @example
 * getExtname("./project/package.json"); // ".json"
 */
export declare function getExtname(str: string): string;
/**
 * @example
 * getFilename("./project/package.json"); // "package"
 */
export declare function getFilename(str: string): string;
/**
 * @example
 * getDirname("./project/package.json"); // "./project"
 */
export declare function getDirname(str: string): string;
/**
 * @example
 * getRelativePath("./project/", "./package.json"); // "../package.json"
 */
export declare function getRelativePath(from: string, to: string): string;
/**
 * @example
 * getRootPath(
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
export declare function toSafeFilename(str: string, replacement?: string): string;
//# sourceMappingURL=path.d.ts.map