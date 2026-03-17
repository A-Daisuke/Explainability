function __method_wrapper__() {
    toNode(): Node {
        const svgNS = "http://www.w3.org/2000/svg";
        const node = document.createElementNS(svgNS, "svg");

        // Apply attributes
        for (const attr in this.attributes) {
            if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
                node.setAttribute(attr, this.attributes[attr]);
            }
        }

        for (let i = 0; i < this.children.length; i++) {
            node.appendChild(this.children[i].toNode());
        }
        return node;
    }

}
