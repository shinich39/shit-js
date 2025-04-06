// src/index.ts
var add = function(a, b) {
  return a + b;
};
var sub = function(a, b) {
  return a - b;
};
var mul = function(a, b) {
  return a * b;
};
var div = function(a, b) {
  return a / b;
};
var wait = function(delay) {
  return new Promise(function(resolve) {
    return setTimeout(resolve, delay);
  });
};
export {
  add,
  div,
  mul,
  sub,
  wait
};
