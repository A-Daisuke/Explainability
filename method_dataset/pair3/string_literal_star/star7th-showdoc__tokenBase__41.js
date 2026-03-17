    function tokenBase(stream, state) {
      var beforeParams = state.beforeParams;
      state.beforeParams = false;
      var ch = stream.next();
      if ((ch == '"' || ch == "'") && state.inParams)
        return chain(stream, state, tokenString(ch));
      else if (/[\[\]{}\(\),;\.]/.test(ch)) {
        if (ch == "(" && beforeParams) state.inParams = true;
        else if (ch == ")") state.inParams = false;
          return null;
      }
      else if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/);
        return "number";
      }
      else if (ch == "#" && stream.eat("*")) {
        return chain(stream, state, tokenComment);
      }
      else if (ch == "#" && stream.match(/ *\[ *\[/)) {
        return chain(stream, state, tokenUnparsed);
      }
      else if (ch == "#" && stream.eat("#")) {
        stream.skipToEnd();
        return "comment";
      }
      else if (ch == '"') {
        stream.skipTo(/"/);
        return "comment";
      }
      else if (ch == "$") {
        stream.eatWhile(/[$_a-z0-9A-Z\.{:]/);
        stream.eatWhile(/}/);
        state.beforeParams = true;
        return "builtin";
      }
      else if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return "comment";
      }
      else {
        stream.eatWhile(/[\w\$_{}\xa1-\uffff]/);
        var word = stream.current().toLowerCase();
        if (keywords && keywords.propertyIsEnumerable(word))
          return "keyword";
        if (functions && functions.propertyIsEnumerable(word)) {
          state.beforeParams = true;
          return "keyword";
        }
        return null;
      }
    }
