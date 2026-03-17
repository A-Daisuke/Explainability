const toMarkup = function(tagName: string): string {
    let markup = `<${tagName}`;

    // Add the class
    if (this.classes.length) {
        markup += ` class="${utils.escape(createClass(this.classes))}"`;
    }

    let styles = "";

    // Add the styles, after hyphenation
    for (const style in this.style) {
        if (this.style.hasOwnProperty(style)) {
            styles += `${utils.hyphenate(style)}:${this.style[style]};`;
        }
    }

    if (styles) {
        markup += ` style="${utils.escape(styles)}"`;
    }

    // Add the attributes
    for (const attr in this.attributes) {
        if (this.attributes.hasOwnProperty(attr)) {
            if (invalidAttributeNameRegex.test(attr)) {
                throw new ParseError(`Invalid attribute name '${attr}'`);
            }
            markup += ` ${attr}="${utils.escape(this.attributes[attr])}"`;
        }
    }

    markup += ">";

    // Add the markup of the children, also as markup
    for (let i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
    }

    markup += `</${tagName}>`;

    return markup;
};
