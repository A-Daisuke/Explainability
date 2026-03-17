class __C__ {
    constructor(data, options = {}) {
      super(data);
      const {
        checkCrc = false
      } = options;
      this._checkCrc = checkCrc;
      this._inflator = new Inflate_1();
      this._png = {
        width: -1,
        height: -1,
        channels: -1,
        data: new Uint8Array(0),
        depth: 1,
        text: {}
      };
      this._apng = {
        width: -1,
        height: -1,
        channels: -1,
        depth: 1,
        numberOfFrames: 1,
        numberOfPlays: 0,
        text: {},
        frames: []
      };
      this._end = false;
      this._hasPalette = false;
      this._palette = [];
      this._hasTransparency = false;
      this._transparency = new Uint16Array(0);
      this._compressionMethod = CompressionMethod.UNKNOWN;
      this._filterMethod = FilterMethod.UNKNOWN;
      this._interlaceMethod = InterlaceMethod.UNKNOWN;
      this._colorType = ColorType.UNKNOWN;
      this._isAnimated = false;
      this._numberOfFrames = 1;
      this._numberOfPlays = 0;
      this._frames = [];
      this._writingDataChunks = false;
      // PNG is always big endian
      // https://www.w3.org/TR/PNG/#7Integers-and-byte-order
      this.setBigEndian();
    }

}
