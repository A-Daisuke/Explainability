const mathmlBuilder: MathMLBuilder<"operatorname"> = (group, options) => {
    // The steps taken here are similar to the html version.
    let expression = mml.buildExpression(
        group.body, options.withFont("mathrm"));

    // Is expression a string or has it something like a fraction?
    let isAllString = true;  // default
    for (let i = 0; i < expression.length; i++) {
        const node = expression[i];
        if (node instanceof mathMLTree.SpaceNode) {
            // Do nothing
        } else if (node instanceof mathMLTree.MathNode) {
            switch (node.type) {
                case "mi":
                case "mn":
                case "ms":
                case "mspace":
                case "mtext":
                    break;  // Do nothing yet.
                case "mo": {
                    const child = node.children[0];
                    if (node.children.length === 1 &&
                        child instanceof mathMLTree.TextNode) {
                        child.text =
                            child.text.replace(/\u2212/, "-")
                                .replace(/\u2217/, "*");
                    } else {
                        isAllString = false;
                    }
                    break;
                }
                default:
                    isAllString = false;
            }
        } else {
            isAllString = false;
        }
    }

    if (isAllString) {
        // Write a single TextNode instead of multiple nested tags.
        const word = expression.map(node => node.toText()).join("");
        expression = [new mathMLTree.TextNode(word)];
    }

    const identifier = new mathMLTree.MathNode("mi", expression);
    identifier.setAttribute("mathvariant", "normal");

    // \u2061 is the same as &ApplyFunction;
    // ref: https://www.w3schools.com/charsets/ref_html_entities_a.asp
    const operator = new mathMLTree.MathNode("mo",
        [mml.makeText("\u2061", "text")]);

    if (group.parentIsSupSub) {
        return new mathMLTree.MathNode("mrow", [identifier, operator]);
    } else {
        return mathMLTree.newDocumentFragment([identifier, operator]);
    }
};
