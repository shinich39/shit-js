/**
 * @example
 * BRACKETS["("]; // ")"
 */
export declare const BRACKETS: {
    readonly "(": ")";
    readonly "[": "]";
    readonly "{": "}";
    readonly "<": ">";
    readonly "\uFF08": "）";
    readonly "\uFF3B": "］";
    readonly "\uFF5B": "｝";
    readonly "\uFF1C": "＞";
    readonly "\u300C": "」";
    readonly "\u300E": "』";
    readonly "\u3010": "】";
    readonly "\u3014": "〕";
    readonly "\u3018": "〙";
    readonly "\u3016": "〗";
    readonly "\u3008": "〉";
    readonly "\u300A": "》";
    readonly "\u2768": "❩";
    readonly "\u276A": "❫";
    readonly "\u2774": "❵";
    readonly "\u276C": "❭";
    readonly "\u276E": "❯";
    readonly "\u2772": "❳";
    readonly "\u301A": "〛";
    readonly "\uFF62": "｣";
    readonly "\u27E8": "⟩";
    readonly "\u2770": "❱";
};
/**
 * @example
 * QUOTES["'"]; // "'"
 */
export declare const QUOTES: {
    readonly "'": "'";
    readonly "\"": "\"";
    readonly "`": "`";
    readonly "\u2018": "’";
    readonly "\u201C": "”";
    readonly "\u201B": "‛";
    readonly "\u201F": "‟";
    readonly "\u201E": "“";
    readonly "\u00AB": "»";
};
/**
 * @example
 * toTitleCase("lorem-ipsum"); // "Lorem Ipsum"
 */
export declare function toTitleCase(str: string): string;
/**
 * @example
 * toSentenceCase("lorem ipsum"); // "Lorem ipsum"
 */
export declare function toSentenceCase(str: string): string;
/**
 * @example
 * toSlug(" Lorem  ipsum "); // "lorem-ipsum"
 */
export declare function toSlug(str: string): string;
/**
 * @example
 * toCamelCase("Lorem ipsum"); // "loremIpsum"
 */
export declare function toCamelCase(str: string): string;
/**
 * @example
 * toPascalCase("lorem ipsum"); // "LoremIpsum"
 */
export declare function toPascalCase(str: string): string;
/**
 * @example
 * generateUuid(); // "ce0e915d-0b16-473c-bd89-d3d7492bb1b9"
 */
export declare function generateUuid(): string;
/**
 * @example
 * generateString("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", 1); // "a"
 * generateString(); // "a"
 */
export declare function generateString(charset?: string, size?: number): string;
/**
 * @example
 * const original = "text";
 * const encrypted = toXor(original, "this is salt!");
 * const decrypted = toXor(encrypted, "this is salt!"); // "text"
 */
export declare function toXor(str: string, salt: string): string;
/**
 * @example
 * conss result = getInts("ftp://192.168.0.1"); // [192, 168, 0, 1]
 */
export declare function getInts(str: string): number[];
/**
 * @example
 * getFloats("ftp://192.168.0.1"); // [192.168, 0.1]
 */
export declare function getFloats(str: string): number[];
/**
 * 1. Change full-width characters to half-width characters
 * 2. Change all type of whitespaces to " "
 *
 * @example
 * toHalfWidthString("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"); // "Hello, world!"
 */
export declare function toHalfWidthString(str: string): string;
/**
 * @example
 * toFullWidthString("Hello, world!"); // "Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"
 */
export declare function toFullWidthString(str: string): string;
/**
 * @example
 * toRegExp("/abc/gi"); // /abc/gi
 */
export declare function toRegExp(str: string): RegExp;
/**
 * Myers algorithm
 *
 * \-1: Number of deleted characters
 *
 * 0: Number of matched characters
 *
 * 1: Number of inserted characters
 *
 * @example
 * getStringDiffs("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export declare function getStringDiffs(from: string, to: string): [number, string][];
/**
 * @example
 * const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * const b = "sit amet, adipiscing";
 * matchStrings(a, b);
 * // {
 * //   matchRate: 0.35714285714285715,
 * //   similarity: 0.35714285714285715,
 * //   diceSimilarity: 0.5263157894736842,
 * //   jaccardSimilarity: 0.35714285714285715,
 * //   distance: 36,
 * //   normalizedDistance: 0.6428571428571429,
 * //   matches: 20,
 * //   insertions: 0,
 * //   deletions: 36
 * // }
 */
export declare function matchStrings(from: string, to: string): {
    matchRate: number;
    similarity: number;
    diceSimilarity: number;
    jaccardSimilarity: number;
    distance: number;
    normalizedDistance: number;
    matches: number;
    insertions: number;
    deletions: number;
};
/**
 * @returns bytes
 * @example
 * const bytes = getStringSize("abc"); // 3
 * const bytes = getStringSize("ㄱㄴㄷ"); // 9
 */
export declare function getStringSize(str: string): number;
//# sourceMappingURL=string.d.ts.map