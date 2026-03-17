    const calculateScore = (node2) => {
      const specificity2 = new Specificity();
      elementLoop:
        for (const element of node2.getChildren()) {
          switch (element.type) {
            case NodeType.IdentifierSelector:
              specificity2.id++;
              break;
            case NodeType.ClassSelector:
            case NodeType.AttributeSelector:
              specificity2.attr++;
              break;
            case NodeType.ElementNameSelector:
              if (element.matches("*")) {
                break;
              }
              specificity2.tag++;
              break;
            case NodeType.PseudoSelector:
              const text = element.getText();
              const childElements = element.getChildren();
              if (this.isPseudoElementIdentifier(text)) {
                if (text.match(/^::slotted/i) && childElements.length > 0) {
                  specificity2.tag++;
                  let mostSpecificListItem = calculateMostSpecificListItem(childElements);
                  specificity2.id += mostSpecificListItem.id;
                  specificity2.attr += mostSpecificListItem.attr;
                  specificity2.tag += mostSpecificListItem.tag;
                  continue elementLoop;
                }
                specificity2.tag++;
                continue elementLoop;
              }
              if (text.match(/^:where/i)) {
                continue elementLoop;
              }
              if (text.match(/^:(?:not|has|is)/i) && childElements.length > 0) {
                let mostSpecificListItem = calculateMostSpecificListItem(childElements);
                specificity2.id += mostSpecificListItem.id;
                specificity2.attr += mostSpecificListItem.attr;
                specificity2.tag += mostSpecificListItem.tag;
                continue elementLoop;
              }
              if (text.match(/^:(?:host|host-context)/i) && childElements.length > 0) {
                specificity2.attr++;
                let mostSpecificListItem = calculateMostSpecificListItem(childElements);
                specificity2.id += mostSpecificListItem.id;
                specificity2.attr += mostSpecificListItem.attr;
                specificity2.tag += mostSpecificListItem.tag;
                continue elementLoop;
              }
              if (text.match(/^:(?:nth-child|nth-last-child)/i) && childElements.length > 0) {
                specificity2.attr++;
                if (childElements.length === 3 && childElements[1].type === 23) {
                  let mostSpecificListItem = calculateMostSpecificListItem(childElements[2].getChildren());
                  specificity2.id += mostSpecificListItem.id;
                  specificity2.attr += mostSpecificListItem.attr;
                  specificity2.tag += mostSpecificListItem.tag;
                  continue elementLoop;
                }
                const parser = new Parser();
                const pseudoSelectorText = childElements[1].getText();
                parser.scanner.setSource(pseudoSelectorText);
                const firstToken = parser.scanner.scan();
                const secondToken = parser.scanner.scan();
                if (firstToken.text === "n" || firstToken.text === "-n" && secondToken.text === "of") {
                  const complexSelectorListNodes = [];
                  const complexSelectorText = pseudoSelectorText.slice(secondToken.offset + 2);
                  const complexSelectorArray = complexSelectorText.split(",");
                  for (const selector of complexSelectorArray) {
                    const node3 = parser.internalParse(selector, parser._parseSelector);
                    if (node3) {
                      complexSelectorListNodes.push(node3);
                    }
                  }
                  let mostSpecificListItem = calculateMostSpecificListItem(complexSelectorListNodes);
                  specificity2.id += mostSpecificListItem.id;
                  specificity2.attr += mostSpecificListItem.attr;
                  specificity2.tag += mostSpecificListItem.tag;
                  continue elementLoop;
                }
                continue elementLoop;
              }
              specificity2.attr++;
              continue elementLoop;
          }
          if (element.getChildren().length > 0) {
            const itemSpecificity = calculateScore(element);
            specificity2.id += itemSpecificity.id;
            specificity2.attr += itemSpecificity.attr;
            specificity2.tag += itemSpecificity.tag;
          }
        }
      return specificity2;
    };
