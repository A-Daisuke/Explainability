function __method_wrapper__() {
    toMarkup(): string {
        let markup = `<svg xmlns="http://www.w3.org/2000/svg"`;

        // Apply attributes
        for (const attr in this.attributes) {
            if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
                markup += ` ${attr}="${utils.escape(this.attributes[attr])}"`;
            }
        }

        markup += ">";

        for (let i = 0; i < this.children.length; i++) {
            markup += this.children[i].toMarkup();
        }

        markup += "</svg>";

        return markup;

    }

}
