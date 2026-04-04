/**
 * Support dot-notation
 *
 * @example
 * const template = createTemplate("Lorem ipsum dolor {a.b.c}");
 *
 * template({ a: { b: { c: "sit amet" } } });
 * // "Lorem ipsum dolor sit amet"
 */
export function createTemplate(template: string): (obj: Record<string, any>) => string {
  const parts = template.split(/\{([\w.]+)\}/).map((part, i) => (i % 2 ? part.split(".") : part));

  return (obj) => {
    let result = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i % 2 === 0) {
        result += part;
        continue;
      }

      let curr: any = obj;

      for (const key of part as string[]) {
        if (curr == null) {
          curr = "";
          break;
        }

        curr = curr[key];
      }

      result += curr ?? "";
    }

    return result;
  };
}
