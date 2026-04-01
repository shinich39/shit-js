/// <reference types="node" />
import { deepStrictEqual as eq, throws } from "node:assert";
import { test } from "node:test";
import { parseDate } from "./parse-date";

test("parseDate", () => {
  const d = parseDate(new Date("2026-03-15T14:30:45.123"));

  // year
  eq(d.YYYY, "2026");
  eq(d.YY, "26");

  // month
  eq(d.M, "3");
  eq(d.MM, "03");

  // day
  eq(d.D, "15");
  eq(d.DD, "15");

  // weekday (2026-03-15 is Sunday)
  eq(d.d, "0");
  eq(d.E, "Sun");
  eq(d.EEEE, "Sunday");

  // hour
  eq(d.H, "14");
  eq(d.HH, "14");
  eq(d.h, "2");
  eq(d.hh, "02");

  // minute
  eq(d.m, "30");
  eq(d.mm, "30");

  // second
  eq(d.s, "45");
  eq(d.ss, "45");

  // millisecond
  eq(d.SSS, "123");

  // AM/PM
  eq(d.A, "PM");
  eq(d.a, "pm");

  // quarter
  eq(d.Q, "1");

  // midnight edge case
  const midnight = parseDate(new Date("2026-03-15T00:00:00"));
  eq(midnight.H, "0");
  eq(midnight.HH, "00");
  eq(midnight.h, "12");
  eq(midnight.hh, "12");
  eq(midnight.A, "AM");

  // noon edge case
  const noon = parseDate(new Date("2026-03-15T12:00:00"));
  eq(noon.h, "12");
  eq(noon.A, "PM");

  // invalid
  throws(() => parseDate("invalid"));
});
