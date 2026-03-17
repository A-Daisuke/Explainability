class __C__ {
  stmt() {
    var tok = this.peek(), selector;
    switch (tok.type) {
      case 'keyframes':
        return this.keyframes();
      case '-moz-document':
        return this.mozdocument();
      case 'comment':
      case 'selector':
      case 'literal':
      case 'charset':
      case 'namespace':
      case 'import':
      case 'require':
      case 'extend':
      case 'media':
      case 'atrule':
      case 'ident':
      case 'scope':
      case 'supports':
      case 'unless':
      case 'function':
      case 'for':
      case 'if':
        return this[tok.type]();
      case 'return':
        return this.return();
      case '{':
        return this.property();
      default:
        // Contextual selectors
        if (this.stateAllowsSelector()) {
          switch (tok.type) {
            case 'color':
            case '~':
            case '>':
            case '<':
            case ':':
            case '&':
            case '&&':
            case '[':
            case '.':
            case '/':
              selector = this.selector();
              selector.column = tok.column;
              selector.lineno = tok.lineno;
              return selector;
            // relative reference
            case '..':
              if ('/' == this.lookahead(2).type)
                return this.selector();
            case '+':
              return 'function' == this.lookahead(2).type
                ? this.functionCall()
                : this.selector();
            case '*':
              return this.property();
            // keyframe blocks (10%, 20% { ... })
            case 'unit':
              if (this.looksLikeKeyframe()) {
                selector = this.selector();
                selector.column = tok.column;
                selector.lineno = tok.lineno;
                return selector;
              }
            case '-':
              if ('{' == this.lookahead(2).type)
                return this.property();
          }
        }

        // Expression fallback
        var expr = this.expression();
        if (expr.isEmpty) this.error('unexpected {peek}');
        return expr;
    }
  }

}
