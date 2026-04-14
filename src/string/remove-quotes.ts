/**
 * @example
 * removeQuotes("\"Lorem ipsum dolor sit amet, consectetur adipiscing elit.\"");
 * // "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 */
export function removeQuotes(str: string): string {
  const quotes = ['"', "'", "`"];

  for (const q of quotes) {
    if (str.startsWith(q) && str.endsWith(q) && str.length > 1) {
      return str.slice(1, -1);
    }
  }

  return str;
}
