  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var sol = stream.sol();
    var ch = stream.next();

    //non start of line
    switch (ch) { //switch is generally much faster than if, so it is used here
    case "{": //plugin
      stream.eat("/");
      stream.eatSpace();
      var tagName = "";
      var c;
      while ((c = stream.eat(/[^\s\u00a0=\"\'\/?(}]/))) tagName += c;
      state.tokenize = inPlugin;
      return "tag";
      break;
    case "_": //bold
      if (stream.eat("_")) {
        return chain(inBlock("strong", "__", inText));
      }
      break;
    case "'": //italics
      if (stream.eat("'")) {
        // Italic text
        return chain(inBlock("em", "''", inText));
      }
      break;
    case "(":// Wiki Link
      if (stream.eat("(")) {
        return chain(inBlock("variable-2", "))", inText));
      }
      break;
    case "[":// Weblink
      return chain(inBlock("variable-3", "]", inText));
      break;
    case "|": //table
      if (stream.eat("|")) {
        return chain(inBlock("comment", "||"));
      }
      break;
    case "-":
      if (stream.eat("=")) {//titleBar
        return chain(inBlock("header string", "=-", inText));
      } else if (stream.eat("-")) {//deleted
        return chain(inBlock("error tw-deleted", "--", inText));
      }
      break;
    case "=": //underline
      if (stream.match("==")) {
        return chain(inBlock("tw-underline", "===", inText));
      }
      break;
    case ":":
      if (stream.eat(":")) {
        return chain(inBlock("comment", "::"));
      }
      break;
    case "^": //box
      return chain(inBlock("tw-box", "^"));
      break;
    case "~": //np
      if (stream.match("np~")) {
        return chain(inBlock("meta", "~/np~"));
      }
      break;
    }

    //start of line types
    if (sol) {
      switch (ch) {
      case "!": //header at start of line
        if (stream.match('!!!!!')) {
          return chain(inLine("header string"));
        } else if (stream.match('!!!!')) {
          return chain(inLine("header string"));
        } else if (stream.match('!!!')) {
          return chain(inLine("header string"));
        } else if (stream.match('!!')) {
          return chain(inLine("header string"));
        } else {
          return chain(inLine("header string"));
        }
        break;
      case "*": //unordered list line item, or <li /> at start of line
      case "#": //ordered list line item, or <li /> at start of line
      case "+": //ordered list line item, or <li /> at start of line
        return chain(inLine("tw-listitem bracket"));
        break;
      }
    }

    //stream.eatWhile(/[&{]/); was eating up plugins, turned off to act less like html and more like tiki
    return null;
  }
