const toNode = function(tagName: string): HTMLElement {
    const node = document.createElement(tagName);

    // Apply the class
    node.className = createClass(this.classes);

    // Apply inline styles
    for (const style in this.style) {
        if (this.style.hasOwnProperty(style)) {
            // $FlowFixMe Flow doesn't seem to understand span.style's type.
            node.style[style] = this.style[style];
        }
    }

    // Apply attributes
    for (const attr in this.attributes) {
        if (this.attributes.hasOwnProperty(attr)) {
            node.setAttribute(attr, this.attributes[attr]);
        }
    }

    // Append the children, also as HTML nodes
    for (let i = 0; i < this.children.length; i++) {
        node.appendChild(this.children[i].toNode());
    }

    return node;
};
