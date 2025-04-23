import { TreeParent, TreeTag } from "./tree";

/**
 * references
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
 *
 * https://drafts.csswg.org/selectors/
 */

type StyleSelector = StyleTag | StyleAttribute | StylePseudo | StyleAt;

type StyleCombinator = " " | ">" | "~" | "+";

interface StyleTag {
  type: "tag";
  value: string;
}

interface StyleAttribute {
  type: "attribute";
  key: string;
  operator?: string;
  value?: string;
  regex?: RegExp;
}

interface StylePseudo {
  type: "pseudo";
  key: string;
  value?: string;
}

interface StyleAt {
  type: "at";
  key: string;
  value?: string;
}

function parseSelector(selector: string) {
  const result: StyleSelector[] = [];

  // start with a at rule (e.g. @media)
  const atMatch = selector.match(/^@([a-zA-Z0-9-]+)(?:\s|$)/);
  if (atMatch) {
    const key = atMatch[1];
    // const value = selector.substring(atMatch[0].length).trim() || undefined;

    // result.push({
    //   type: "at",
    //   key,
    //   value,
    // });

    // return result;

    throw new Error(`Invalid argument: @${key} not supported`);
  }

  // start with a tag
  const tagMatch = selector.match(/^[^.#[:][^.#[:]*/);
  if (tagMatch) {
    const value = tagMatch[0];

    result.push({
      type: "tag",
      value,
    });
  }

  // get id, class, attributes, pseudo,
  const re = /\.([^.#[:]+)|#([^.#[:]+)|\[([^\]]+)|(::?[^.#[:]+)/g;
  let match;
  while ((match = re.exec(selector))) {
    // class
    if (match[1]) {
      const value = match[1];

      result.push({
        type: "attribute",
        key: "class",
        value,
        operator: "~=",
        regex: new RegExp(`(?:^|\\s)${value}(?:\\s|$)`),
      });
    } // id
    else if (match[2]) {
      const value = match[2];

      result.push({
        type: "attribute",
        key: "id",
        value,
        operator: "~=",
        regex: new RegExp(`(?:^|\\s)${value}(?:\\s|$)`),
      });
    } // attrs
    else if (match[3]) {
      let key: string;
      let value: string | undefined;
      let operator: string | undefined;

      const operatorMatch = match[3].match(/[~|^$*]?=/);

      // no value
      if (!operatorMatch) {
        key = match[3];
      } // value with key
      else {
        key = match[3].substring(0, operatorMatch.index);
        value = match[3].substring(
          (operatorMatch.index as number) + operatorMatch[0].length
        );

        // remove quotes
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.substring(1, value.length - 1);
        }

        operator = operatorMatch[0];
      }

      // [attr]
      if (!operator) {
        result.push({
          type: "attribute",
          key,
          value,
        });

        continue;
      }

      // no attr value
      if (typeof value !== "string") {
        continue;
      }

      // [attr=value]
      if (operator === "=") {
        result.push({
          type: "attribute",
          key,
          value,
          operator,
          regex: new RegExp(`^${value}$`),
        });
      } // [attr~=value]
      else if (operator === "~=") {
        result.push({
          type: "attribute",
          key,
          value,
          operator,
          regex: new RegExp(`(?:^|\\s)${value}(?:\\s|$)`),
        });
      } // [attr|=value]
      else if (operator === "|=") {
        result.push({
          type: "attribute",
          key,
          value,
          operator,
          regex: new RegExp(`(?:^|\\s)${value}(?:\\s|-|$)`),
        });
      } // [attr*=value]
      else if (operator === "*=") {
        result.push({
          type: "attribute",
          key,
          value,
          operator,
          regex: new RegExp(value),
        });
      } // [attr^=value]
      else if (operator === "^=") {
        result.push({
          type: "attribute",
          key,
          value,
          operator,
          regex: new RegExp(`(?:^|\\s)${value}`),
        });
      } // [attr$=value]
      else if (operator === "$=") {
        result.push({
          type: "attribute",
          key,
          value,
          operator,
          regex: new RegExp(`${value}(?:\\s|$)`),
        });
      } // operator
      else {
        // not supported yet
        // console.log(`Operator not supported: ${operator}`);
        throw new Error(`Invalid argument: operator ${operator} not supported`);
      }
    } // pseudo
    else if (match[4]) {
      const pseudoMatch = match[4].match(/\(([^)]+)\)/);

      let key, value;
      if (pseudoMatch) {
        key = match[4].substring(0, pseudoMatch.index);
        value = pseudoMatch[1];
      } else {
        key = match[4];
      }

      result.push({
        type: "pseudo",
        key, // ::key, :key
        value,
      });
    }
  }

  return result;
}

function splitSelector(str: string) {
  const result: {
    combinator: StyleCombinator;
    selectors: StyleSelector[];
  }[] = [
    {
      combinator: " ",
      selectors: [],
    },
  ];

  let buffer = "",
    quotes = null,
    bracket = null,
    combinator = null;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === "\\") {
      buffer += char;

      i++;

      // skip next char
      if (i < str.length) {
        buffer += str[i];
      }

      continue;
    }

    if (quotes) {
      if (quotes === char) {
        quotes = null;
      }

      buffer += char;

      continue;
    }

    if (bracket) {
      if (bracket === "[" && char === "]") {
        bracket = null;
      }

      buffer += char;

      continue;
    }

    if (char === ">" || char === "+" || char === "~" || char === " ") {
      if (!combinator) {
        combinator = char;

        result[result.length - 1].selectors.push(...parseSelector(buffer));

        buffer = "";
      } else {
        combinator += char;
      }

      continue;
    }

    if (combinator) {
      const value = combinator.trim() || " ";

      if (value !== " " && value !== ">" && value !== "~" && value !== "+") {
        throw new Error(
          `Invalid argument: combinator ${value} is not supported`
        );
      }

      result.push({
        combinator: value,
        selectors: [],
      });

      combinator = null;
    }

    if (char === `"` || char === `'`) {
      quotes = char;

      buffer += char;

      continue;
    }

    if (char === "[") {
      bracket = char;

      buffer += char;

      continue;
    }

    buffer += char;
  }

  if (buffer.length > 0) {
    result[result.length - 1].selectors.push(...parseSelector(buffer));
  }

  return result;
}

function getCandidates(node: TreeParent, combinator: StyleCombinator) {
  if (combinator === " " || combinator === ">") {
    return node.children.filter((child) => child.type === "tag") as TreeTag[];
  }

  const result: TreeTag[] = [];

  let toggle = false;
  for (const sibling of (node as TreeTag).parent.children) {
    if (sibling.type !== "tag") {
      continue;
    }

    if (!toggle) {
      if (sibling == node) {
        toggle = true;
      }
      continue;
    }

    result.push(sibling);

    if (combinator === "+") {
      break;
    }
  }

  return result;
}

function matchSelectors(
  parent: TreeParent,
  selectors: StyleSelector[],
  combinator: StyleCombinator
) {
  let result: TreeTag[] = [];

  const candidates = getCandidates(parent, combinator);

  for (const c of candidates) {
    let toggle = true;

    for (const s of selectors) {
      if (s.type === "tag") {
        if (s.value !== "*" && s.value !== c.tag) {
          toggle = false;
          break;
        }
      } else if (s.type === "attribute") {
        const attr = c.attrs[s.key];

        // exists
        if (!s.regex) {
          if (typeof attr === "undefined") {
            toggle = false;
            break;
          }
        } else {
          // not matched
          if (!attr || !attr.match(s.regex)) {
            toggle = false;
            break;
          }
        }
      } else if (s.type === "pseudo") {
        // not support yet
        toggle = false;
        break;

        // const siblings = c.parent.children;

        // let key = s.key;
        // let value = s.value;

        // if (key === ":first-child") {
        //   for (const sibling of siblings) {
        //     if (sibling.type !== "tag") {
        //       continue;
        //     }

        //     if (sibling != c) {
        //       toggle = false;
        //     }

        //     break;
        //   }
        // } else if (key === ":last-child") {
        //   for (let i = siblings.length - 1; i >= 0; i--) {
        //     const sibling = siblings[i];

        //     if (sibling.type !== "tag") {
        //       continue;
        //     }

        //     if (sibling != c) {
        //       toggle = false;
        //     }

        //     break;
        //   }
        // } else if (key === ":nth-child") {
        //   toggle = false;
        //   break;
        // } else if (key === ":nth-last-child") {
        //   toggle = false;
        //   break;
        // }
      }
    }

    // add matched node
    if (toggle) {
      result.push(c);
    }
  }

  if (combinator === " ") {
    for (const c of candidates) {
      result.push(...matchSelectors(c, selectors, combinator));
    }
  }

  return result;
}

export function selectChild(
  parent: TreeParent,
  selecotr: string
): TreeTag | undefined {
  return selectChildren(parent, selecotr)[0];
}

export function selectChildren(
  parent: TreeParent,
  selector: string
): TreeTag[] {
  // normalize
  selector = selector.trim();

  const stages = splitSelector(selector);

  // first combinator must be " "
  let targets: TreeTag[] = [parent as TreeTag];

  for (const { combinator, selectors } of stages) {
    const prevTargets = targets;

    targets = [];

    for (const target of prevTargets) {
      targets.push(...matchSelectors(target, selectors, combinator));
    }
  }

  return targets;
}
