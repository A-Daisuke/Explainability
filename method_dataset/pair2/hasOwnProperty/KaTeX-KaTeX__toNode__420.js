function __method_wrapper__() {
    toNode(): Node {
        const node = document.createTextNode(this.text);
        let span = null;

        if (this.italic > 0) {
            span = document.createElement("span");
            span.style.marginRight = makeEm(this.italic);
        }

        if (this.classes.length > 0) {
            span = span || document.createElement("span");
            span.className = createClass(this.classes);
        }

        for (const style in this.style) {
            if (this.style.hasOwnProperty(style)) {
                span = span || document.createElement("span");
                // $FlowFixMe Flow doesn't seem to understand span.style's type.
                span.style[style] = this.style[style];
            }
        }

        if (span) {
            span.appendChild(node);
            return span;
        } else {
            return node;
        }
    }

}
