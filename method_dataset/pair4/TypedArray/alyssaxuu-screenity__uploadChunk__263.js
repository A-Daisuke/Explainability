class __C__ {
  async uploadChunk(chunk) {
    const data = new Uint8Array(await chunk.arrayBuffer());

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // Use current offset atomically to prevent race conditions
        const currentOffset = this.offset;

        const res = await fetch(this.uploadUrl, {
          method: "PATCH",
          headers: {
            "Tus-Resumable": "1.0.0",
            "Content-Type": "application/offset+octet-stream",
            "Upload-Offset": String(currentOffset),
            AuthorizationSignature: this.signature,
            AuthorizationExpire: String(this.expires),
            LibraryId: String(this.libraryId),
            VideoId: this.videoId,
          },
          body: data,
        });

        if (res.ok || res.status === 204) {
          // Verify server offset matches our expectation
          const serverOffset = res.headers.get("Upload-Offset");
          const expectedOffset = currentOffset + data.length;

          if (serverOffset) {
            const actualOffset = parseInt(serverOffset);
            if (actualOffset !== expectedOffset) {
              console.warn(
                `⚠️ Offset mismatch! Expected: ${expectedOffset}, Server: ${actualOffset}`
              );
              this.offset = actualOffset;
            } else {
              this.offset = expectedOffset;
            }
          } else {
            this.offset = expectedOffset;
          }

          return;
        } else {
          const errorText = await res.text();

          // Handle offset mismatch errors (409 Conflict)
          if (
            res.status === 409 ||
            errorText.toLowerCase().includes("offset")
          ) {
            console.warn(
              `⚠️ Offset conflict detected (status ${res.status}), fetching current offset from server`
            );

            // Query server for current offset using HEAD request
            try {
              const headRes = await fetch(this.uploadUrl, {
                method: "HEAD",
                headers: {
                  "Tus-Resumable": "1.0.0",
                  AuthorizationSignature: this.signature,
                  AuthorizationExpire: String(this.expires),
                  LibraryId: String(this.libraryId),
                  VideoId: this.videoId,
                },
              });

              if (headRes.ok) {
                const serverOffset = parseInt(
                  headRes.headers.get("Upload-Offset") || "0"
                );
                console.log(
                  `📊 Server offset: ${serverOffset}, Local offset was: ${this.offset}`
                );
                this.offset = serverOffset;

                // Retry with corrected offset
                continue;
              }
            } catch (headErr) {
              console.error("Failed to fetch server offset:", headErr);
            }
          }

          throw new Error(`Upload failed (${res.status}): ${errorText}`);
        }
      } catch (err) {
        if (attempt === this.MAX_RETRIES) {
          console.error(
            `❌ Failed to upload chunk after ${this.MAX_RETRIES} retries:`,
            err
          );
          throw err;
        }
        console.warn(
          `⚠️ Upload attempt ${attempt + 1}/${
            this.MAX_RETRIES + 1
          } failed, retrying...`,
          err.message
        );
        await new Promise((r) =>
          setTimeout(r, this.RETRY_DELAY * Math.pow(2, attempt))
        );
      }
    }
  }

}
