function __method_wrapper__() {
setup('fsetstat', mustCall((client, server) => {
  const handle_ = Buffer.from('node.js');
  const attrs_ = new Stats({
    uid: 9001,
    gid: 9001,
    atime: (Date.now() / 1000) | 0,
    mtime: (Date.now() / 1000) | 0
  });
  server.on('FSETSTAT', mustCall((id, handle, attrs) => {
    assert(id === 0, `Wrong request id: ${id}`);
    assert.deepStrictEqual(handle, handle_, 'handle mismatch');
    assert.deepStrictEqual(attrs, attrs_, 'attrs mismatch');
    server.status(id, STATUS_CODE.OK);
    server.end();
  }));
  client.fsetstat(handle_, attrs_, mustCall((err) => {
    assert(!err, `Unexpected fsetstat() error: ${err}`);
  }));
}));

}
