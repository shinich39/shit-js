/**
 * @example
 * const str = `Lorem "ipsum" dolor sit amet, 'consectetur' adipiscing elit.`;
 * extractStrings(str); // ["ipsum", "consectetur"];
 */
export function extractStrings(
  str: string,
  pairs: Record<string, string> = {
    '"': '"',
    "'": "'",
  },
): string[] {
  const headSet = new Set(Object.keys(pairs));

  const result: string[] = [];

  let tails: string[] = [],
    buffer = "",
    i = 0;

  while (i < str.length) {
    const ch = str[i];

    // character is last tail
    if (tails.length > 0 && ch === tails[tails.length - 1]) {
      // remove last tail
      tails.pop();

      if (tails.length > 0) {
        buffer += ch;
      } else {
        result.push(buffer);
        buffer = "";
      }

      i++;
      continue;
    }

    if (headSet.has(ch)) {
      tails.push(pairs[ch]!);

      if (tails.length > 1) {
        buffer += ch;
      }

      i++;
      continue;
    }

    if (tails.length > 0) {
      buffer += ch;
    }

    i++;
  }

  return result;
}
