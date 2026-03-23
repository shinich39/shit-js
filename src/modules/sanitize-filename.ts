/**
 * @example
 * sanitizeFilename("hello/world"); // "hello_world"
 * sanitizeFilename("abc\u0000def"); // "abc_def"
 * sanitizeFilename("file."); // "file"
 * sanitizeFilename("///", "-"); // "---"
 */
export function sanitizeFilename(str: string, replacement = "_"): string {
  return (
    str
      // remove windows restricts specific characters: \ / : * ? " < > |
      .replace(/[\\/:*?"<>|]+/g, replacement)
      // remove control characters: 0x00 ~ 0x1F
      // biome-ignore lint/suspicious/noControlCharactersInRegex: nope
      .replace(/[\u0000-\u001F\u007F]+/g, replacement)
      // remove trailing dot
      .replace(/[. ]+$/, "") || replacement
  );
}
