function __method_wrapper__() {
  async _npmFetch(tarball: string): Promise<Map<string, Uint8Array>> {
    const cacheEntry = this.cache.fetch.get(tarball);
    if (cacheEntry) {
      return cacheEntry;
    }

    const res = await fetch(tarball);
    if (!res.ok) {
      throw new Error(`npmFetch failed: fetching ${tarball} - ${res.status}`);
    }

    let result;
    if (!res.arrayBuffer) {
      // node
      var bufs = [];
      res.body.on('data', function (d) {
        bufs.push(d);
      });

      const buffer = await new Promise(resolve =>
        res.body.on('end', () => {
          resolve(Buffer.concat(bufs));
        }),
      );

      result = new ArrayBuffer(buffer.length);
      var view = new Uint8Array(result);
      for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
      }
    } else {
      // browser
      result = await res.arrayBuffer();
    }

    let untarred = untar(result);

    this.cache.fetch.set(tarball, untarred);
    return untarred;
  }

}
