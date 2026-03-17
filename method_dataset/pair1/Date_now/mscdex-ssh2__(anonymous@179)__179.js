function __method_wrapper__() {
setup('fstat', mustCall((client, server) => {
  const handle_ = Buffer.from('node.js');
  const attrs_ = new Stats({
    size: 10 * 1024,
    uid: 9001,
    gid: 9001,
    atime: (Date.now() / 1000) | 0,
    mtime: (Date.now() / 1000) | 0
  });
  server.on('FSTAT', mustCall((id, handle) => {
    assert(id === 0, `Wrong request id: ${id}`);
    assert.deepStrictEqual(handle, handle_, 'handle mismatch');
    server.attrs(id, attrs_);
    server.end();
  }));
  client.fstat(handle_, mustCall((err, attrs) => {
    assert(!err, `Unexpected fstat() error: ${err}`);
    assert.deepStrictEqual(attrs, attrs_, 'attrs mismatch');
  }));
}));

}
