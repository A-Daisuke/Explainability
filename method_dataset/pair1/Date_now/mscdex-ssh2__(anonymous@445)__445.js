function __method_wrapper__() {
setup('stat', mustCall((client, server) => {
  const path_ = '/foo/bar/baz';
  const attrs_ = new Stats({
    mode: 0o644 | constants.S_IFREG,
    size: 10 * 1024,
    uid: 9001,
    gid: 9001,
    atime: (Date.now() / 1000) | 0,
    mtime: (Date.now() / 1000) | 0
  });
  server.on('STAT', mustCall((id, path) => {
    assert(id === 0, `Wrong request id: ${id}`);
    assert(path === path_, `Wrong path: ${path}`);
    server.attrs(id, attrs_);
    server.end();
  }));
  client.stat(path_, mustCall((err, attrs) => {
    assert(!err, `Unexpected stat() error: ${err}`);
    assert.deepStrictEqual(attrs, attrs_, 'attrs mismatch');
    const expectedTypes = {
      isDirectory: false,
      isFile: true,
      isBlockDevice: false,
      isCharacterDevice: false,
      isSymbolicLink: false,
      isFIFO: false,
      isSocket: false
    };
    for (const [fn, expect] of Object.entries(expectedTypes))
      assert(attrs[fn]() === expect, `attrs.${fn}() failed`);
  }));
}));

}
