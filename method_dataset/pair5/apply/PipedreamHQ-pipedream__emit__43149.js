function __method_wrapper__() {
Dicer.prototype.emit = function (ev) {
  if (ev === 'finish' && !this._realFinish) {
    if (!this._finished) {
      const self = this
      process.nextTick(function () {
        self.emit('error', new Error('Unexpected end of multipart data'))
        if (self._part && !self._ignoreData) {
          const type = (self._isPreamble ? 'Preamble' : 'Part')
          self._part.emit('error', new Error(type + ' terminated early due to unexpected end of multipart data'))
          self._part.push(null)
          process.nextTick(function () {
            self._realFinish = true
            self.emit('finish')
            self._realFinish = false
          })
          return
        }
        self._realFinish = true
        self.emit('finish')
        self._realFinish = false
      })
    }
  } else { WritableStream.prototype.emit.apply(this, arguments) }
}

}
