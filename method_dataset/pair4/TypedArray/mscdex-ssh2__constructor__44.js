class __C__ {
  constructor(mode) {
    const windowBits = Z_DEFAULT_WINDOWBITS;
    const level = Z_DEFAULT_COMPRESSION;
    const memLevel = Z_DEFAULT_MEMLEVEL;
    const strategy = Z_DEFAULT_STRATEGY;
    const dictionary = undefined;

    this._err = undefined;
    this._writeState = new Uint32Array(2);
    this._chunkSize = Z_DEFAULT_CHUNK;
    this._maxOutputLength = kMaxLength;
    this._outBuffer = Buffer.allocUnsafe(this._chunkSize);
    this._outOffset = 0;

    this._handle = new ZlibHandle(mode);
    this._handle._owner = this;
    this._handle.onerror = zlibOnError;
    this._handle.init(windowBits,
                      level,
                      memLevel,
                      strategy,
                      this._writeState,
                      processCallback,
                      dictionary);
  }

}
