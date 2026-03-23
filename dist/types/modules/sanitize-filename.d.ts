/**
 * @example
 * sanitizeFilename("hello/world"); // "hello_world"
 * sanitizeFilename("abc\u0000def"); // "abc_def"
 * sanitizeFilename("file."); // "file"
 * sanitizeFilename("///", "-"); // "---"
 */
export declare function sanitizeFilename(str: string, replacement?: string): string;
//# sourceMappingURL=sanitize-filename.d.ts.map