    function tokenBase(stream, state) {
      if (stream.eatSpace()) return null;
  
      var sol = stream.sol();
      var ch = stream.next();
  
      if (ch === '\\') {
        stream.next();
        return null;
      }
      if (ch === '\'' || ch === '"' || ch === '`') {
        state.tokens.unshift(tokenString(ch, ch === "`" ? "quote" : "string"));
        return tokenize(stream, state);
      }
      if (ch === '#') {
        if (sol && stream.eat('!')) {
          stream.skipToEnd();
          return 'meta'; // 'comment'?
        }
        stream.skipToEnd();
        return 'comment';
      }
      if (ch === '$') {
        state.tokens.unshift(tokenDollar);
        return tokenize(stream, state);
      }
      if (ch === '+' || ch === '=') {
        return 'operator';
      }
      if (ch === '-') {
        stream.eat('-');
        stream.eatWhile(/\w/);
        return 'attribute';
      }
      if (ch == "<") {
        if (stream.match("<<")) return "operator"
        var heredoc = stream.match(/^<-?\s*['"]?([^'"]*)['"]?/)
        if (heredoc) {
          state.tokens.unshift(tokenHeredoc(heredoc[1]))
          return 'string-2'
        }
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/\d/);
        if(stream.eol() || !/\w/.test(stream.peek())) {
          return 'number';
        }
      }
      stream.eatWhile(/[\w-]/);
      var cur = stream.current();
      if (stream.peek() === '=' && /\w+/.test(cur)) return 'def';
      return words.hasOwnProperty(cur) ? words[cur] : null;
    }
