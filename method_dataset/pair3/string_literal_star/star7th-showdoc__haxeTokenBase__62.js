  function haxeTokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'")
      return chain(stream, state, haxeTokenString(ch));
    else if (/[\[\]{}\(\),;\:\.]/.test(ch))
      return ret(ch);
    else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    }
    else if (/\d/.test(ch) || ch == "-" && stream.eat(/\d/)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    }
    else if (state.reAllowed && (ch == "~" && stream.eat(/\//))) {
      nextUntilUnescaped(stream, "/");
      stream.eatWhile(/[gimsu]/);
      return ret("regexp", "string-2");
    }
    else if (ch == "/") {
      if (stream.eat("*")) {
        return chain(stream, state, haxeTokenComment);
      }
      else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      }
      else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", null, stream.current());
      }
    }
    else if (ch == "#") {
        stream.skipToEnd();
        return ret("conditional", "meta");
    }
    else if (ch == "@") {
      stream.eat(/:/);
      stream.eatWhile(/[\w_]/);
      return ret ("metadata", "meta");
    }
    else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", null, stream.current());
    }
    else {
    var word;
    if(/[A-Z]/.test(ch))
    {
      stream.eatWhile(/[\w_<>]/);
      word = stream.current();
      return ret("type", "variable-3", word);
    }
    else
    {
        stream.eatWhile(/[\w_]/);
        var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
        return (known && state.kwAllowed) ? ret(known.type, known.style, word) :
                       ret("variable", "variable", word);
    }
    }
  }
