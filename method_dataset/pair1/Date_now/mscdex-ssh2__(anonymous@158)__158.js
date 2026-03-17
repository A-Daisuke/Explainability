function __method_wrapper__() {
setup('lstat', mustCall((client, server) => {
  const path_ = '/foo/bar/baz';
  const attrs_ = new Stats({
    size: 10 * 1024,
    uid: 9001,
    gid: 9001,
    atime: (Date.now() / 1000) | 0,
    mtime: (Date.now() / 1000) | 0
  });
  server.on('LSTAT', mustCall((id, path) => {
    assert(id === 0, `Wrong request id: ${id}`);
    assert(path === path_, `Wrong path: ${path}`);
    server.attrs(id, attrs_);
    server.end();
  }));
  client.lstat(path_, mustCall((err, attrs) => {
    assert(!err, `Unexpected lstat() error: ${err}`);
    assert.deepStrictEqual(attrs, attrs_, 'attrs mismatch');
  }));
}));

}
