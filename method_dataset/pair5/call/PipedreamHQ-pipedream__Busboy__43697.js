function Busboy (opts) {
  if (!(this instanceof Busboy)) { return new Busboy(opts) }

  if (typeof opts !== 'object') {
    throw new TypeError('Busboy expected an options-Object.')
  }
  if (typeof opts.headers !== 'object') {
    throw new TypeError('Busboy expected an options-Object with headers-attribute.')
  }
  if (typeof opts.headers['content-type'] !== 'string') {
    throw new TypeError('Missing Content-Type-header.')
  }

  const {
    headers,
    ...streamOptions
  } = opts

  this.opts = {
    autoDestroy: false,
    ...streamOptions
  }
  WritableStream.call(this, this.opts)

  this._done = false
  this._parser = this.getParserByHeaders(headers)
  this._finished = false
}
