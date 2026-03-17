function __method_wrapper__() {
    decodeApngImage() {
      this._apng.width = this._png.width;
      this._apng.height = this._png.height;
      this._apng.channels = this._png.channels;
      this._apng.depth = this._png.depth;
      this._apng.numberOfFrames = this._numberOfFrames;
      this._apng.numberOfPlays = this._numberOfPlays;
      this._apng.text = this._png.text;
      this._apng.resolution = this._png.resolution;
      for (let i = 0; i < this._numberOfFrames; i++) {
        const newFrame = {
          sequenceNumber: this._frames[i].sequenceNumber,
          delayNumber: this._frames[i].delayNumber,
          delayDenominator: this._frames[i].delayDenominator,
          data: this._apng.depth === 8 ? new Uint8Array(this._apng.width * this._apng.height * this._apng.channels) : new Uint16Array(this._apng.width * this._apng.height * this._apng.channels)
        };
        const frame = this._frames.at(i);
        if (frame) {
          frame.data = decodeInterlaceNull({
            data: frame.data,
            width: frame.width,
            height: frame.height,
            channels: this._apng.channels,
            depth: this._apng.depth
          });
          if (this._hasPalette) {
            this._apng.palette = this._palette;
          }
          if (this._hasTransparency) {
            this._apng.transparency = this._transparency;
          }
          if (i === 0 || frame.xOffset === 0 && frame.yOffset === 0 && frame.width === this._png.width && frame.height === this._png.height) {
            newFrame.data = frame.data;
          } else {
            const prevFrame = this._apng.frames.at(i - 1);
            this.disposeFrame(frame, prevFrame, newFrame);
            this.addFrameDataToCanvas(newFrame, frame);
          }
          this._apng.frames.push(newFrame);
        }
      }
      return this._apng;
    }

}
