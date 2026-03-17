function __method_wrapper__() {
    grayscale() {
        if (this.channels === 1) {
            return this;
        }

        let newData = new Uint8ClampedArray(this.width * this.height * 1);
        switch (this.channels) {
            case 3: // rgb to grayscale
            case 4: // rgba to grayscale
                for (let i = 0, offset = 0; i < this.data.length; i += this.channels) {
                    const red = this.data[i];
                    const green = this.data[i + 1];
                    const blue = this.data[i + 2];

                    newData[offset++] = Math.round(0.2989 * red + 0.5870 * green + 0.1140 * blue);
                }
                break;
            default:
                throw new Error(`Conversion failed due to unsupported number of channels: ${this.channels}`);
        }
        return this._update(newData, this.width, this.height, 1);
    }

}
