function Writable(fn, options) {
  if (!(this instanceof Writable))
    return new Writable(fn, options);

  PassThrough.call(this, options);

  beforeFirstCall(this, '_write', function () {
    var destination = fn.call(this, options);
    var emit = this.emit.bind(this, 'error');
    destination.on('error', emit);
    this.pipe(destination);
  });

  this.emit('writable');
}
