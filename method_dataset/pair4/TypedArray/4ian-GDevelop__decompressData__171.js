    async function decompressData(
      receivedData: Uint8Array | string
    ): Promise<object | undefined> {
      if (compressionMethod === 'none') {
        // If no compression is used, we just parse the data.
        if (typeof receivedData !== 'string') {
          logger.error(
            `Error while parsing message using compressionMethod ${compressionMethod}: received data is not a string.`
          );
          return;
        }

        try {
          const parsedData = JSON.parse(receivedData);
          return parsedData;
        } catch (e) {
          logger.error(`Error while parsing message: ${e.toString()}`);
          return;
        }
      }
      const compressionStreamFormat =
        compressionMethod === 'cs:gzip' ? 'gzip' : 'deflate';

      // @ts-ignore - We checked that DecompressionStream is available in the browser.
      const ds = new DecompressionStream(compressionStreamFormat);
      const writer = ds.writable.getWriter();
      writer.write(receivedData);
      writer.close();

      const decompressedStream = ds.readable;
      const reader = decompressedStream.getReader();
      const chunks: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const decompressedData = new Uint8Array(
        chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
      );
      const decoder = new TextDecoder();
      const jsonStringData = decoder.decode(decompressedData); // Convert Uint8Array back to string
      try {
        const parsedData = JSON.parse(jsonStringData);
        return parsedData;
      } catch (e) {
        logger.error(`Error while parsing message: ${e.toString()}`);
        return;
      }
    }
