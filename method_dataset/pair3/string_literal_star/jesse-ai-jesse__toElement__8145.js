function toElement(node, parentElement) {
  let result = new Element();
  for (const child of node.getChildren()) {
    switch (child.type) {
      case NodeType.SelectorCombinator:
        if (parentElement) {
          const segments = child.getText().split("&");
          if (segments.length === 1) {
            result.addAttr("name", segments[0]);
            break;
          }
          result = parentElement.cloneWithParent();
          if (segments[0]) {
            const root = result.findRoot();
            root.prepend(segments[0]);
          }
          for (let i = 1; i < segments.length; i++) {
            if (i > 1) {
              const clone = parentElement.cloneWithParent();
              result.addChild(clone.findRoot());
              result = clone;
            }
            result.append(segments[i]);
          }
        }
        break;
      case NodeType.SelectorPlaceholder:
        if (child.matches("@at-root")) {
          return result;
        }
      case NodeType.ElementNameSelector:
        const text = child.getText();
        result.addAttr("name", text === "*" ? "element" : unescape(text));
        break;
      case NodeType.ClassSelector:
        result.addAttr("class", unescape(child.getText().substring(1)));
        break;
      case NodeType.IdentifierSelector:
        result.addAttr("id", unescape(child.getText().substring(1)));
        break;
      case NodeType.MixinDeclaration:
        result.addAttr("class", child.getName());
        break;
      case NodeType.PseudoSelector:
        result.addAttr(unescape(child.getText()), "");
        break;
      case NodeType.AttributeSelector:
        const selector = child;
        const identifier = selector.getIdentifier();
        if (identifier) {
          const expression = selector.getValue();
          const operator = selector.getOperator();
          let value;
          if (expression && operator) {
            switch (unescape(operator.getText())) {
              case "|=":
                value = `${quotes.remove(unescape(expression.getText()))}-\u2026`;
                break;
              case "^=":
                value = `${quotes.remove(unescape(expression.getText()))}\u2026`;
                break;
              case "$=":
                value = `\u2026${quotes.remove(unescape(expression.getText()))}`;
                break;
              case "~=":
                value = ` \u2026 ${quotes.remove(unescape(expression.getText()))} \u2026 `;
                break;
              case "*=":
                value = `\u2026${quotes.remove(unescape(expression.getText()))}\u2026`;
                break;
              default:
                value = quotes.remove(unescape(expression.getText()));
                break;
            }
          }
          result.addAttr(unescape(identifier.getText()), value);
        }
        break;
    }
  }
  return result;
}
