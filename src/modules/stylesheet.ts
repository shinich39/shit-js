import { Tree, TreeParent } from "./tree";

interface ParsedStyle {
  mediaQuery?: string;
  selectors: string[];
  declarations: Record<string, string>;
}

function parseDeclaration(str: string) {
  const result: Record<string, string> = {};

  const re = /([^:]+):([^;]+);/g;

  let match;
  while ((match = re.exec(str))) {
    const key = match[1].trim();
    const value = match[2].trim();
    result[key] = value;
  }

  return result;
}

function parseStyle(style: string) {
  // normalize
  style = style
    // remove comments
    .replace(/\/\*[\s\S]*?\*\//g, "");
  // remove multiple spacing
  // .replace(/\s+/g, " ");

  const result: ParsedStyle[] = [];

  const func = (str: string, mediaQuery?: string) => {
    const re = /(@media )?([^{]+){([^}]*?)}/g;
    let match;
    while ((match = re.exec(str))) {
      const isMediaQuery = !!match[1];

      if (isMediaQuery) {
        func(match[3], match[2]);
        continue;
      }

      const selectors = match[2]
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const declarations = parseDeclaration(match[3]);

      result.push({
        mediaQuery,
        selectors,
        declarations,
      });
    }
  };

  func(style);

  return result;
}

export function setStyle(parent: TreeParent, style: string) {
  const parsedStyles = parseStyle(style);

  for (const s of parsedStyles) {
    if (s.mediaQuery) {
      // not supported yet
      continue;
    }

    const declarations = s.declarations;

    if (Object.keys(declarations).length === 0) {
      continue;
    }

    for (const selector of s.selectors) {
      const children = Tree.selectAll(parent, selector);

      for (const child of children) {
        if (typeof child.attrs.style !== "string") {
          child.attrs.style = "";
        }

        const newStyle = Object.assign(
          parseDeclaration(child.attrs.style),
          declarations
        );

        child.attrs.style = Object.entries(newStyle)
          .map(([k, v]) => `${k}:${v};`)
          .join("");
      }
    }
  }
}

// export function setStyle(parent: TreeParent, style: string) {

//   const parsedStyles = parseStyle(style);

//   for (const s of parsedStyles) {

//     if (s.mediaQuery) {
//       // not supported yet
//       continue;
//     }

//     const declarations = Object.keys(s.declarations).map((key) => {
//       return {
//         key,
//         value: s.declarations[key],
//         regex: new RegExp(`(${key}\s*:\s*)[^;]*;`),
//       }
//     });

//     if (declarations.length === 0) {
//       continue;
//     }

//     for (const selector of s.selectors) {

//       const children = Tree.selectAll(parent, selector);

//       for (const child of children) {

//         if (typeof child.attrs.style !== "string") {
//           child.attrs.style = "";
//         }

//         for (const {key, value, regex} of declarations) {
//           if (!child.attrs.style.match(regex)) {
//             child.attrs.style += `${key}:${value};`;
//           } else {
//             child.attrs.style = child.attrs.style.replace(regex, `$1${value};`)
//           }
//         }
//       }
//     }
//   }
// }
