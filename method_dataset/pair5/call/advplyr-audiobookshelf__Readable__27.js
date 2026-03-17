function Readable(fn, options) {
  if (!(this instanceof Readable))
    return new Readable(fn, options);

  PassThrough.call(this, options);

  beforeFirstCall(this, '_read', function () {
    var source = fn.call(this, options);
    var emit = this.emit.bind(this, 'error');
    source.on('error', emit);
    source.pipe(this);
  });

  this.emit('readable');
}
