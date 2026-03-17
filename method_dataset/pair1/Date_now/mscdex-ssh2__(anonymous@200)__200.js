function __method_wrapper__() {
setup('setstat', mustCall((client, server) => {
  const path_ = '/foo/bar/baz';
  const attrs_ = new Stats({
    uid: 9001,
    gid: 9001,
    atime: (Date.now() / 1000) | 0,
    mtime: (Date.now() / 1000) | 0
  });
  server.on('SETSTAT', mustCall((id, path, attrs) => {
    assert(id === 0, `Wrong request id: ${id}`);
    assert(path === path_, `Wrong path: ${path}`);
    assert.deepStrictEqual(attrs, attrs_, 'attrs mismatch');
    server.status(id, STATUS_CODE.OK);
    server.end();
  }));
  client.setstat(path_, attrs_, mustCall((err) => {
    assert(!err, `Unexpected setstat() error: ${err}`);
  }));
}));

}
