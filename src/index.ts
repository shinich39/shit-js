export const add = function (a: number, b: number) {
  return a + b;
};

export const sub = function (a: number, b: number) {
  return a - b;
};

export const mul = function (a: number, b: number) {
  return a * b;
};

export const div = function (a: number, b: number) {
  return a / b;
};

export const wait = function (delay: number) {
  return new Promise<void>(function (resolve) {
    return setTimeout(resolve, delay);
  });
};
