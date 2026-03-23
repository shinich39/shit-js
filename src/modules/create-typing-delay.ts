/**
 * @param speed slow < 1 < fast (default: 1)
 *
 * @example
 * const gen = createTypingDelay();
 * const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * for (cosnt char of str) {
 *   const delay = gen(char, 1);
 *   process.stdout.write(char);
 *   await sleep(delay);
 * }
 */
export function createTypingDelay(): (char: string, speed: number) => number {
  const generateBase = (min: number, max: number) => Math.random() * (max - min) + min;
  let velocity = 0;
  let drift = 0;
  return (char, speed = 1) => {
    const scale = (v: number) => v / speed;

    let base: number;

    // sentence
    if (/[.,!?]/.test(char)) {
      base = generateBase(scale(300), scale(480));
    } // word
    else if (char === " ") {
      base = generateBase(scale(180), scale(300));
    } // character
    else {
      base = generateBase(scale(85), scale(130));
    }

    velocity += (Math.random() - 0.5) * scale(1.1);
    velocity *= 0.8;

    drift += (Math.random() - 0.5) * scale(0.3);
    drift = Math.max(-scale(4.5), Math.min(drift, scale(4.5)));

    const accel = velocity * scale(4.5) + drift;

    base -= accel;

    // clamp
    return Math.max(scale(45), Math.min(base, scale(520)));
  };
}
