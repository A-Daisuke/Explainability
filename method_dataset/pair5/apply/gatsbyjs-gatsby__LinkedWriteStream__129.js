    function LinkedWriteStream(
      this: fs.WriteStream,
      ...args: Parameters<(typeof fs)["createWriteStream"]>
    ): fs.WriteStream {
      args[0] = mapPathUsingRewrites(args[0])
      args[1] =
        typeof args[1] === `string`
          ? {
              flags: args[1],
              // @ts-ignore there is `fs` property in options doh (https://nodejs.org/api/fs.html#fscreatewritestreampath-options)
              fs: lfs,
            }
          : {
              ...(args[1] || {}),
              // @ts-ignore there is `fs` property in options doh (https://nodejs.org/api/fs.html#fscreatewritestreampath-options)
              fs: lfs,
            }

      // @ts-ignore TS doesn't like extending prototype "classes"
      return originalWritesStream.apply(this, args)
    }
