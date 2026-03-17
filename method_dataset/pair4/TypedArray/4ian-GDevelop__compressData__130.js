    async function compressData(data: object): Promise<Uint8Array | string> {
      if (compressionMethod === 'none') {
        // If no compression is used, we just stringify the data,
        // PeerJS will compress it to binary data.
        const jsonString = JSON.stringify(data);
        return jsonString;
      }

      const compressionStreamFormat =
        compressionMethod === 'cs:gzip' ? 'gzip' : 'deflate';

      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const array = encoder.encode(jsonString);

      // @ts-ignore - We checked that CompressionStream is available in the browser.
      const cs = new CompressionStream(compressionStreamFormat);
      const writer = cs.writable.getWriter();
      writer.write(array);
      writer.close();

      const compressedStream = cs.readable;
      const reader = compressedStream.getReader();
      const chunks: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const compressedData = new Uint8Array(
        chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
      );
      return compressedData;
    }
