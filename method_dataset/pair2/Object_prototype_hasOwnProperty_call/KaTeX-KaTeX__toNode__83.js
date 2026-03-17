function __method_wrapper__() {
    toNode(): Node {
        const node = document.createElementNS(
            "http://www.w3.org/1998/Math/MathML", this.type);

        for (const attr in this.attributes) {
            if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
                node.setAttribute(attr, this.attributes[attr]);
            }
        }

        if (this.classes.length > 0) {
            node.className = createClass(this.classes);
        }

        for (let i = 0; i < this.children.length; i++) {
            // Combine multiple TextNodes into one TextNode, to prevent
            // screen readers from reading each as a separate word [#3995]
            if (this.children[i] instanceof TextNode &&
                this.children[i + 1] instanceof TextNode) {
                let text = this.children[i].toText() + this.children[++i].toText();
                while (this.children[i + 1] instanceof TextNode) {
                    text += this.children[++i].toText();
                }
                node.appendChild(new TextNode(text).toNode());
            } else {
                node.appendChild(this.children[i].toNode());
            }
        }

        return node;
    }

}
