  function tokenBase(stream, state) {
    // String
    var ch = stream.peek();
    if (ch == "'" || ch == '"') {
      stream.next();
      return chain(stream, state, tokenString(ch, "string", "string"));
    }
    // Comment
    else if (ch == "/") {
      stream.next();
      if (stream.eat("*")) {
        return chain(stream, state, tokenComment);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else {
        stream.skipTo(" ");
        return ret("operator", "operator");
      }
    }
    // Decimal
    else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:e[+\-]?\d+)?/);
      return ret("number", "number");
    }
    // Hash
    else if (ch == "#") {
      stream.next();
      // Symbol with string syntax
      ch = stream.peek();
      if (ch == '"') {
        stream.next();
        return chain(stream, state, tokenString('"', "symbol", "string-2"));
      }
      // Binary number
      else if (ch == "b") {
        stream.next();
        stream.eatWhile(/[01]/);
        return ret("number", "number");
      }
      // Hex number
      else if (ch == "x") {
        stream.next();
        stream.eatWhile(/[\da-f]/i);
        return ret("number", "number");
      }
      // Octal number
      else if (ch == "o") {
        stream.next();
        stream.eatWhile(/[0-7]/);
        return ret("number", "number");
      }
      // Hash symbol
      else {
        stream.eatWhile(/[-a-zA-Z]/);
        return ret("hash", "keyword");
      }
    } else if (stream.match("end")) {
      return ret("end", "keyword");
    }
    for (var name in patterns) {
      if (patterns.hasOwnProperty(name)) {
        var pattern = patterns[name];
        if ((pattern instanceof Array && pattern.some(function(p) {
          return stream.match(p);
        })) || stream.match(pattern))
          return ret(name, patternStyles[name], stream.current());
      }
    }
    if (stream.match("define")) {
      return ret("definition", "def");
    } else {
      stream.eatWhile(/[\w\-]/);
      // Keyword
      if (wordLookup[stream.current()]) {
        return ret(wordLookup[stream.current()], styleLookup[stream.current()], stream.current());
      } else if (stream.current().match(symbol)) {
        return ret("variable", "variable");
      } else {
        stream.next();
        return ret("other", "variable-2");
      }
    }
  }
