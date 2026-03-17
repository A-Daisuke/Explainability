function __method_wrapper__() {
    toMarkup(): string {
        let markup = `<img src="${utils.escape(this.src)}"` +
          ` alt="${utils.escape(this.alt)}"`;

        // Add the styles, after hyphenation
        let styles = "";
        for (const style in this.style) {
            if (this.style.hasOwnProperty(style)) {
                styles += `${utils.hyphenate(style)}:${this.style[style]};`;
            }
        }
        if (styles) {
            markup += ` style="${utils.escape(styles)}"`;
        }

        markup += "'/>";
        return markup;
    }

}
