            function deflateSync(literals) {
              if (!(0, _is_node.default)()) {
                return deflateSyncUncompressed(literals);
              }

              try {
                var input;

                if (parseInt(process.versions.node) >= 8) {
                  input = literals;
                } else {
                  input = new Buffer(literals);
                }

                var output = require("zlib").deflateSync(input, {
                  level: 9
                });

                return output instanceof Uint8Array
                  ? output
                  : new Uint8Array(output);
              } catch (e) {
                (0, _util.warn)(
                  "Not compressing PNG because zlib.deflateSync is unavailable: " +
                    e
                );
              }

              return deflateSyncUncompressed(literals);
            }
