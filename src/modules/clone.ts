export function clone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => clone(item)) as any;
  }
  return Object.entries(obj).reduce<Record<string, any>>((acc, cur) => {
    acc[cur[0]] = clone(cur[1]);
    return acc;
  }, {}) as any;
}