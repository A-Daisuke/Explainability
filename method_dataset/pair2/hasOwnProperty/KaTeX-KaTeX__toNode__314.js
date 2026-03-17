function __method_wrapper__() {
    toNode(): Node {
        const node = document.createElement("img");
        node.src = this.src;
        node.alt = this.alt;
        node.className = "mord";

        // Apply inline styles
        for (const style in this.style) {
            if (this.style.hasOwnProperty(style)) {
                // $FlowFixMe
                node.style[style] = this.style[style];
            }
        }

        return node;
    }

}
