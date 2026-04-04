/**
 * Support dot-notation
 *
 * @example
 * const template = createTemplate("Lorem ipsum dolor {a.b.c}");
 *
 * template({ a: { b: { c: "sit amet" } } });
 * // "Lorem ipsum dolor sit amet"
 */
export declare function createTemplate(template: string): (obj: Record<string, any>) => string;
//# sourceMappingURL=create-template.d.ts.map