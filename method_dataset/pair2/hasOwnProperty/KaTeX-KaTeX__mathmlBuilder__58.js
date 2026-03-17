function __method_wrapper__() {
    mathmlBuilder(group, options) {
        let node;

        if (regularSpace.hasOwnProperty(group.text)) {
            node = new mathMLTree.MathNode(
                "mtext", [new mathMLTree.TextNode("\u00a0")]);
        } else if (cssSpace.hasOwnProperty(group.text)) {
            // CSS-based MathML spaces (\nobreak, \allowbreak) are ignored
            return new mathMLTree.MathNode("mspace");
        } else {
            throw new ParseError(`Unknown type of space "${group.text}"`);
        }

        return node;
    },

}
