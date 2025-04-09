/**
 * @returns bytes
 */
export function calcStringSize(str: string) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x7f) {
      // 1 byte for ASCII
      result += 1;
    } else if (code <= 0x7ff) {
      // 2 bytes for characters in range U+0080 to U+07FF
      result += 2;
    } else if (code <= 0xffff) {
      // 3 bytes for characters in range U+0800 to U+FFFF
      result += 3;
    } else {
      // 4 bytes for characters in range U+10000 to U+10FFFF
      result += 4;
    }
  }
  return result;
}

export function convertFileSize(
  num: number, 
  from: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB", 
  to: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = units.indexOf(from);
  if (i === -1) {
    throw new Error(`Invalid source unit: ${from}`);
  }

  const j = units.indexOf(to);
  if (j === -1) {
    throw new Error(`Invalid destination unit: ${to}`);
  }

  return num * Math.pow(1024, i - j);
}

export function humanizeFileSize(
  num: number, 
  format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) {
  const bytes = convertFileSize(num, format, "Bytes");
  if (bytes === 0) {
    return "0 Bytes";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  // keep 2 decimal places
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  return (
    size + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i]
  );
}
