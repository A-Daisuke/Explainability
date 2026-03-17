class __C__ {
    decodetRNS(length) {
      switch (this._colorType) {
        case ColorType.GREYSCALE:
        case ColorType.TRUECOLOUR:
          {
            if (length % 2 !== 0) {
              throw new RangeError(`tRNS chunk length must be a multiple of 2. Got ${length}`);
            }
            if (length / 2 > this._png.width * this._png.height) {
              throw new Error(`tRNS chunk contains more alpha values than there are pixels (${length / 2} vs ${this._png.width * this._png.height})`);
            }
            this._hasTransparency = true;
            this._transparency = new Uint16Array(length / 2);
            for (let i = 0; i < length / 2; i++) {
              this._transparency[i] = this.readUint16();
            }
            break;
          }
        case ColorType.INDEXED_COLOUR:
          {
            if (length > this._palette.length) {
              throw new Error(`tRNS chunk contains more alpha values than there are palette colors (${length} vs ${this._palette.length})`);
            }
            let i = 0;
            for (; i < length; i++) {
              const alpha = this.readByte();
              this._palette[i].push(alpha);
            }
            for (; i < this._palette.length; i++) {
              this._palette[i].push(255);
            }
            break;
          }
        // Kept for exhaustiveness.
        /* eslint-disable unicorn/no-useless-switch-case */
        case ColorType.UNKNOWN:
        case ColorType.GREYSCALE_ALPHA:
        case ColorType.TRUECOLOUR_ALPHA:
        default:
          {
            throw new Error(`tRNS chunk is not supported for color type ${this._colorType}`);
          }
        /* eslint-enable unicorn/no-useless-switch-case */
      }
    }

}
