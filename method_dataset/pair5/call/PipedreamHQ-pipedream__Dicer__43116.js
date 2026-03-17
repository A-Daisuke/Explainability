function Dicer (cfg) {
  if (!(this instanceof Dicer)) { return new Dicer(cfg) }
  WritableStream.call(this, cfg)

  if (!cfg || (!cfg.headerFirst && typeof cfg.boundary !== 'string')) { throw new TypeError('Boundary required') }

  if (typeof cfg.boundary === 'string') { this.setBoundary(cfg.boundary) } else { this._bparser = undefined }

  this._headerFirst = cfg.headerFirst

  this._dashes = 0
  this._parts = 0
  this._finished = false
  this._realFinish = false
  this._isPreamble = true
  this._justMatched = false
  this._firstWrite = true
  this._inHeader = true
  this._part = undefined
  this._cb = undefined
  this._ignoreData = false
  this._partOpts = { highWaterMark: cfg.partHwm }
  this._pause = false

  const self = this
  this._hparser = new HeaderParser(cfg)
  this._hparser.on('header', function (header) {
    self._inHeader = false
    self._part.emit('header', header)
  })
}
