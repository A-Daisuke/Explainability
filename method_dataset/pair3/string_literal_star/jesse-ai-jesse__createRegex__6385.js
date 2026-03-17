function createRegex(glob, opts) {
  if (typeof glob !== "string") {
    throw new TypeError("Expected a string");
  }
  const str = String(glob);
  let reStr = "";
  const extended = opts ? !!opts.extended : false;
  const globstar = opts ? !!opts.globstar : false;
  let inGroup = false;
  const flags = opts && typeof opts.flags === "string" ? opts.flags : "";
  let c;
  for (let i = 0, len = str.length; i < len; i++) {
    c = str[i];
    switch (c) {
      case "/":
      case "$":
      case "^":
      case "+":
      case ".":
      case "(":
      case ")":
      case "=":
      case "!":
      case "|":
        reStr += "\\" + c;
        break;
      case "?":
        if (extended) {
          reStr += ".";
          break;
        }
      case "[":
      case "]":
        if (extended) {
          reStr += c;
          break;
        }
      case "{":
        if (extended) {
          inGroup = true;
          reStr += "(";
          break;
        }
      case "}":
        if (extended) {
          inGroup = false;
          reStr += ")";
          break;
        }
      case ",":
        if (inGroup) {
          reStr += "|";
          break;
        }
        reStr += "\\" + c;
        break;
      case "*":
        const prevChar = str[i - 1];
        let starCount = 1;
        while (str[i + 1] === "*") {
          starCount++;
          i++;
        }
        const nextChar = str[i + 1];
        if (!globstar) {
          reStr += ".*";
        } else {
          const isGlobstar = starCount > 1 && (prevChar === "/" || prevChar === void 0 || prevChar === "{" || prevChar === ",") && (nextChar === "/" || nextChar === void 0 || nextChar === "," || nextChar === "}");
          if (isGlobstar) {
            if (nextChar === "/") {
              i++;
            } else if (prevChar === "/" && reStr.endsWith("\\/")) {
              reStr = reStr.substr(0, reStr.length - 2);
            }
            reStr += "((?:[^/]*(?:/|$))*)";
          } else {
            reStr += "([^/]*)";
          }
        }
        break;
      default:
        reStr += c;
    }
  }
  if (!flags || !~flags.indexOf("g")) {
    reStr = "^" + reStr + "$";
  }
  return new RegExp(reStr, flags);
}
