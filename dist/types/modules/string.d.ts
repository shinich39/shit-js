export declare const Brackets: {
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
export declare const Quotes: {
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
 * const uuid = getUUID(); // "ce0e915d-0b16-473c-bd89-d3d7492bb1b9"
 */
export declare function getUUID(): string;
/**
 * @example
 * const result = getRandomChar("abc"); // "a"
 */
export declare function getRandomChar(charset: string): string;
/**
 * @example
 * const result = getRandomString("abc", 1); // "a"
 */
export declare function getRandomString(charset: string, size: number): string;
export declare function getInts(str: string): number[];
export declare function getFloats(str: string): number[];
/**
 * @example
 * const encrypted = getXORString("text", "this is salt!");
 * const decrypted = getXORString(encrypted, "this is salt!"); // "text"
 */
export declare function getXORString(str: string, salt: string): string;
/**
 * 1. Change full-width characters to half-width characters
 * 2. Change all type of whitespaces to " "
 */
export declare function normalizeString(str: string): string;
/**
 * @example
 * const result = toRegExp("/abc/gi"); // /abc/gi
 */
export declare function toRegExp(str: string): RegExp;
/**
 * myers Algorithm
 *
 * \-1: number of deleted characters
 *
 * 0: number of matched characters
 *
 * 1: number of inserted characters
 *
 * @example
 * const result = compareString("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export declare function compareString(from: string, to: string): [0 | 1 | -1, string][];
/**
 * @example
 * const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * const b = "sit amet, adipiscing";
 * const result = matchStrings(a, b);
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
//# sourceMappingURL=string.d.ts.map