          function textdecode(encoding, value) {
            if (encoding) {
              if (!/^[\x00-\xFF]+$/.test(value)) {
                return value;
              }

              try {
                var decoder = new TextDecoder(encoding, {
                  fatal: true
                });
                var bytes = Array.from(value, function(ch) {
                  return ch.charCodeAt(0) & 0xff;
                });
                value = decoder.decode(new Uint8Array(bytes));
                needsEncodingFixup = false;
              } catch (e) {
                if (/^utf-?8$/i.test(encoding)) {
                  try {
                    value = decodeURIComponent(escape(value));
                    needsEncodingFixup = false;
                  } catch (err) {}
                }
              }
            }

            return value;
          }
