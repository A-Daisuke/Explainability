const __obj__ = {
            preEvaluateFont: function PartialEvaluator_preEvaluateFont(dict) {
              var baseDict = dict;
              var type = dict.get("Subtype");

              if (!(0, _primitives.isName)(type)) {
                throw new _util.FormatError("invalid font Subtype");
              }

              var composite = false;
              var uint8array;

              if (type.name === "Type0") {
                var df = dict.get("DescendantFonts");

                if (!df) {
                  throw new _util.FormatError(
                    "Descendant fonts are not specified"
                  );
                }

                dict = Array.isArray(df) ? this.xref.fetchIfRef(df[0]) : df;
                type = dict.get("Subtype");

                if (!(0, _primitives.isName)(type)) {
                  throw new _util.FormatError("invalid font Subtype");
                }

                composite = true;
              }

              var descriptor = dict.get("FontDescriptor");

              if (descriptor) {
                var hash = new _murmurhash.MurmurHash3_64();
                var encoding = baseDict.getRaw("Encoding");

                if ((0, _primitives.isName)(encoding)) {
                  hash.update(encoding.name);
                } else if ((0, _primitives.isRef)(encoding)) {
                  hash.update(encoding.toString());
                } else if ((0, _primitives.isDict)(encoding)) {
                  var keys = encoding.getKeys();

                  for (var i = 0, ii = keys.length; i < ii; i++) {
                    var entry = encoding.getRaw(keys[i]);

                    if ((0, _primitives.isName)(entry)) {
                      hash.update(entry.name);
                    } else if ((0, _primitives.isRef)(entry)) {
                      hash.update(entry.toString());
                    } else if (Array.isArray(entry)) {
                      var diffLength = entry.length,
                        diffBuf = new Array(diffLength);

                      for (var j = 0; j < diffLength; j++) {
                        var diffEntry = entry[j];

                        if ((0, _primitives.isName)(diffEntry)) {
                          diffBuf[j] = diffEntry.name;
                        } else if (
                          (0, _util.isNum)(diffEntry) ||
                          (0, _primitives.isRef)(diffEntry)
                        ) {
                          diffBuf[j] = diffEntry.toString();
                        }
                      }

                      hash.update(diffBuf.join());
                    }
                  }
                }

                var toUnicode =
                  dict.get("ToUnicode") || baseDict.get("ToUnicode");

                if ((0, _primitives.isStream)(toUnicode)) {
                  var stream = toUnicode.str || toUnicode;
                  uint8array = stream.buffer
                    ? new Uint8Array(
                        stream.buffer.buffer,
                        0,
                        stream.bufferLength
                      )
                    : new Uint8Array(
                        stream.bytes.buffer,
                        stream.start,
                        stream.end - stream.start
                      );
                  hash.update(uint8array);
                } else if ((0, _primitives.isName)(toUnicode)) {
                  hash.update(toUnicode.name);
                }

                var widths = dict.get("Widths") || baseDict.get("Widths");

                if (widths) {
                  uint8array = new Uint8Array(new Uint32Array(widths).buffer);
                  hash.update(uint8array);
                }
              }

              return {
                descriptor: descriptor,
                dict: dict,
                baseDict: baseDict,
                composite: composite,
                type: type.name,
                hash: hash ? hash.hexdigest() : ""
              };
            },

};
