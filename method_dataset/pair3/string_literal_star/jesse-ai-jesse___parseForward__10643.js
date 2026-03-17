function __method_wrapper__() {
  _parseForward() {
    if (!this.peekKeyword("@forward")) {
      return null;
    }
    const node = this.create(Forward);
    this.consumeToken();
    if (!node.addChild(this._parseStringLiteral())) {
      return this.finish(node, ParseError.StringLiteralExpected);
    }
    if (this.acceptIdent("as")) {
      const identifier = this._parseIdent([ReferenceType.Forward]);
      if (!node.setIdentifier(identifier)) {
        return this.finish(node, ParseError.IdentifierExpected);
      }
      if (this.hasWhitespace() || !this.acceptDelim("*")) {
        return this.finish(node, ParseError.WildcardExpected);
      }
    }
    if (this.acceptIdent("with")) {
      if (!this.accept(TokenType.ParenthesisL)) {
        return this.finish(node, ParseError.LeftParenthesisExpected, [TokenType.ParenthesisR]);
      }
      if (!node.getParameters().addChild(this._parseModuleConfigDeclaration())) {
        return this.finish(node, ParseError.VariableNameExpected);
      }
      while (this.accept(TokenType.Comma)) {
        if (this.peek(TokenType.ParenthesisR)) {
          break;
        }
        if (!node.getParameters().addChild(this._parseModuleConfigDeclaration())) {
          return this.finish(node, ParseError.VariableNameExpected);
        }
      }
      if (!this.accept(TokenType.ParenthesisR)) {
        return this.finish(node, ParseError.RightParenthesisExpected);
      }
    } else if (this.peekIdent("hide") || this.peekIdent("show")) {
      if (!node.addChild(this._parseForwardVisibility())) {
        return this.finish(node, ParseError.IdentifierOrVariableExpected);
      }
    }
    if (!this.accept(TokenType.SemiColon) && !this.accept(TokenType.EOF)) {
      return this.finish(node, ParseError.SemiColonExpected);
    }
    return this.finish(node);
  }

}
