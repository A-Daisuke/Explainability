              function sanitizeMetrics(font, header, metrics, numGlyphs) {
                if (!header) {
                  if (metrics) {
                    metrics.data = null;
                  }

                  return;
                }

                font.pos = (font.start ? font.start : 0) + header.offset;
                font.pos += 4;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 2;
                font.pos += 8;
                font.pos += 2;
                var numOfMetrics = font.getUint16();

                if (numOfMetrics > numGlyphs) {
                  (0, _util.info)(
                    "The numOfMetrics (" +
                      numOfMetrics +
                      ") should not be " +
                      "greater than the numGlyphs (" +
                      numGlyphs +
                      ")"
                  );
                  numOfMetrics = numGlyphs;
                  header.data[34] = (numOfMetrics & 0xff00) >> 8;
                  header.data[35] = numOfMetrics & 0x00ff;
                }

                var numOfSidebearings = numGlyphs - numOfMetrics;
                var numMissing =
                  numOfSidebearings -
                  ((metrics.length - numOfMetrics * 4) >> 1);

                if (numMissing > 0) {
                  var entries = new Uint8Array(metrics.length + numMissing * 2);
                  entries.set(metrics.data);
                  metrics.data = entries;
                }
              }
