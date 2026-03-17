  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      return startString(ch, stream, state);
    }
    // Wildcard import w/o trailing semicolon (import smth.*)
    if (ch == "." && stream.eat("*")) {
      return "word";
    }
    if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (/\d/.test(ch)) {
      if (stream.eat(/eE/)) {
        stream.eat(/\+\-/);
        stream.eatWhile(/\d/);
      }
      return "number";
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize.push(tokenComment);
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
      if (expectExpression(state.lastToken)) {
        return startString(ch, stream, state);
      }
    }
    // Commented
    if (ch == "-" && stream.eat(">")) {
      curPunc = "->";
      return null;
    }
    if (/[\-+*&%=<>!?|\/~]/.test(ch)) {
      stream.eatWhile(/[\-+*&%=<>|~]/);
      return "operator";
    }
    stream.eatWhile(/[\w\$_]/);

    var cur = stream.current();
    if (atoms.propertyIsEnumerable(cur)) {
      return "atom";
    }
    if (softKeywords.propertyIsEnumerable(cur)) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      return "softKeyword";
    }

    if (keywords.propertyIsEnumerable(cur)) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      return "keyword";
    }
    return "word";
  }
