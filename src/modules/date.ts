/**
 * @example
 * const result = parseDate(new Date());
 * // {
 * //   YYYY: '2025',
 * //   YY: '25',
 * //   M: '10',
 * //   MM: '10',
 * //   D: '27',
 * //   DD: '27',
 * //   d: '1',
 * //   E: 'Mon',
 * //   EEEE: 'Monday',
 * //   H: '18',
 * //   HH: '18',
 * //   h: '6',
 * //   hh: '06',
 * //   m: '4',
 * //   mm: '04',
 * //   s: '37',
 * //   ss: '37',
 * //   SSS: '022',
 * //   A: 'PM',
 * //   a: 'pm',
 * //   Q: '4',
 * //   Z: '+09:00',
 * //   ZZ: '+0900',
 * //   W: '44',
 * //   WW: '44'
 * // }
 */
export function parseDate(date: Date|number|string) {

  let ensuredDate;
  if (date instanceof Date) {
    ensuredDate = date;
  } else {
    ensuredDate = new Date(date);
  }

  if (isNaN(ensuredDate.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  // Year
  const YYYY = String(ensuredDate.getFullYear()); // 2025
  const YY = YYYY.slice(-2); // 25

  // Month
  const M = String(ensuredDate.getMonth() + 1); // 1 ~ 12
  const MM = M.padStart(2, "0"); // 01 ~ 12

  // Day
  const D = String(ensuredDate.getDate()); // 1 ~ 31
  const DD = D.padStart(2, "0"); // 01 ~ 31

  // Weekday (0: Sunday)
  const d = String(ensuredDate.getDay()); // 0 ~ 6
  const E = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][ensuredDate.getDay()];
  const EEEE = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][ensuredDate.getDay()];

  // Hour
  const H = String(ensuredDate.getHours()); // 0 ~ 23
  const HH = H.padStart(2, "0"); // 00 ~ 23
  const h = String((ensuredDate.getHours() % 12) || 12); // 1 ~ 12
  const hh = h.padStart(2, "0"); // 01 ~ 12

  // Minute, Second, Millisecond
  const m = String(ensuredDate.getMinutes()); // 0 ~ 59
  const mm = m.padStart(2, "0"); // 00 ~ 59
  const s = String(ensuredDate.getSeconds()); // 0 ~ 59
  const ss = s.padStart(2, "0"); // 00 ~ 59
  const SSS = String(ensuredDate.getMilliseconds()).padStart(3, "0"); // 000 ~ 999

  // AM / PM
  const A = ensuredDate.getHours() < 12 ? "AM" : "PM";
  const a = A.toLowerCase(); // am / pm

  // Quarter
  const Q = String(Math.floor((ensuredDate.getMonth() + 3) / 3)); // 1 ~ 4

  // Timezone offset
  const tzOffset = -ensuredDate.getTimezoneOffset(); // in minutes
  const tzSign = tzOffset >= 0 ? "+" : "-";
  const tzHour = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0");
  const tzMin = String(Math.abs(tzOffset) % 60).padStart(2, "0");
  const Z = `${tzSign}${tzHour}:${tzMin}`; // +09:00
  const ZZ = `${tzSign}${tzHour}${tzMin}`; // +0900

  // ISO week year (roughly)
  const startOfYear = new Date(ensuredDate.getFullYear(), 0, 1);
  const diffMs = ensuredDate.getTime() - startOfYear.getTime();
  const diffDays = diffMs / 86400000;
  const week = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);
  const W = String(week);
  const WW = W.padStart(2, "0");

  return {
    YYYY, YY, M, MM, D, DD, d, E, EEEE,
    H, HH, h, hh, m, mm, s, ss, SSS,
    A, a, Q, Z, ZZ, W, WW,
  };
}