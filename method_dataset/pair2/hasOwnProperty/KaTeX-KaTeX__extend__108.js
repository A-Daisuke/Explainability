function __method_wrapper__() {
    extend(extension: $Shape<OptionsData>): Options {
        const data = {
            style: this.style,
            size: this.size,
            textSize: this.textSize,
            color: this.color,
            phantom: this.phantom,
            font: this.font,
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            fontShape: this.fontShape,
            maxSize: this.maxSize,
            minRuleThickness: this.minRuleThickness,
        };

        for (const key in extension) {
            if (extension.hasOwnProperty(key)) {
                data[key] = extension[key];
            }
        }

        return new Options(data);
    }

}
