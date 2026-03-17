function __method_wrapper__() {
    toMarkup(): string {
        let markup = "<" + this.type;

        // Add the attributes
        for (const attr in this.attributes) {
            if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
                markup += " " + attr + "=\"";
                markup += utils.escape(this.attributes[attr]);
                markup += "\"";
            }
        }

        if (this.classes.length > 0) {
            markup += ` class ="${utils.escape(createClass(this.classes))}"`;
        }

        markup += ">";

        for (let i = 0; i < this.children.length; i++) {
            markup += this.children[i].toMarkup();
        }

        markup += "</" + this.type + ">";

        return markup;
    }

}
