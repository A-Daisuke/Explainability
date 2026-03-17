            function deflateSyncUncompressed(literals) {
              var len = literals.length;
              var maxBlockLength = 0xffff;
              var deflateBlocks = Math.ceil(len / maxBlockLength);
              var idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
              var pi = 0;
              idat[pi++] = 0x78;
              idat[pi++] = 0x9c;
              var pos = 0;

              while (len > maxBlockLength) {
                idat[pi++] = 0x00;
                idat[pi++] = 0xff;
                idat[pi++] = 0xff;
                idat[pi++] = 0x00;
                idat[pi++] = 0x00;
                idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
                pi += maxBlockLength;
                pos += maxBlockLength;
                len -= maxBlockLength;
              }

              idat[pi++] = 0x01;
              idat[pi++] = len & 0xff;
              idat[pi++] = (len >> 8) & 0xff;
              idat[pi++] = ~len & 0xffff & 0xff;
              idat[pi++] = ((~len & 0xffff) >> 8) & 0xff;
              idat.set(literals.subarray(pos), pi);
              pi += literals.length - pos;
              var adler = adler32(literals, 0, literals.length);
              idat[pi++] = (adler >> 24) & 0xff;
              idat[pi++] = (adler >> 16) & 0xff;
              idat[pi++] = (adler >> 8) & 0xff;
              idat[pi++] = adler & 0xff;
              return idat;
            }
