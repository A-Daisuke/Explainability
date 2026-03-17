class __C__ {
  _parseUse() {
    if (!this.peekKeyword("@use")) {
      return null;
    }
    const node = this.create(Use);
    this.consumeToken();
    if (!node.addChild(this._parseStringLiteral())) {
      return this.finish(node, ParseError.StringLiteralExpected);
    }
    if (!this.peek(TokenType.SemiColon) && !this.peek(TokenType.EOF)) {
      if (!this.peekRegExp(TokenType.Ident, /as|with/)) {
        return this.finish(node, ParseError.UnknownKeyword);
      }
      if (this.acceptIdent("as") && (!node.setIdentifier(this._parseIdent([ReferenceType.Module])) && !this.acceptDelim("*"))) {
        return this.finish(node, ParseError.IdentifierOrWildcardExpected);
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
      }
    }
    if (!this.accept(TokenType.SemiColon) && !this.accept(TokenType.EOF)) {
      return this.finish(node, ParseError.SemiColonExpected);
    }
    return this.finish(node);
  }

}
