/**
 * @param speed slow < 1 < fast (default: 1)
 *
 * @example
 * const td = createTypingDelay();
 * const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * for (cosnt char of str) {
 *   const delay = td(char, 1);
 *   process.stdout.write(char);
 *   await sleep(delay);
 * }
 */
export declare function createTypingDelay(): (char: string, speed: number) => number;
//# sourceMappingURL=create-typing-delay.d.ts.map