/**
 * @example
 * fromKb(1); // 1024
 */
export function fromKb(kb: number): number {
  return kb * 1024;
}

/**
 * @example
 * fromMb(1); // 1048576
 */
export function fromMb(mb: number): number {
  return mb * 1024 ** 2;
}

/**
 * @example
 * fromGb(1); // 1073741824
 */
export function fromGb(gb: number): number {
  return gb * 1024 ** 3;
}

/**
 * @example
 * fromTb(1); // 1099511627776
 */
export function fromTb(tb: number): number {
  return tb * 1024 ** 4;
}

/**
 * @example
 * toKb(1024); // 1
 */
export function toKb(bytes: number): number {
  return bytes / 1024;
}

/**
 * @example
 * toMb(1048576); // 1
 */
export function toMb(bytes: number): number {
  return bytes / 1024 ** 2;
}

/**
 * @example
 * toGb(1073741824); // 1
 */
export function toGb(bytes: number): number {
  return bytes / 1024 ** 3;
}

/**
 * @example
 * toTb(1099511627776); // 1
 */
export function toTb(bytes: number): number {
  return bytes / 1024 ** 4;
}
