function __method_wrapper__() {
          FlateStream.prototype.generateHuffmanTable = function flateStreamGenerateHuffmanTable(
            lengths
          ) {
            var n = lengths.length;
            var maxLen = 0;
            var i;

            for (i = 0; i < n; ++i) {
              if (lengths[i] > maxLen) {
                maxLen = lengths[i];
              }
            }

            var size = 1 << maxLen;
            var codes = new Int32Array(size);

            for (
              var len = 1, code = 0, skip = 2;
              len <= maxLen;
              ++len, code <<= 1, skip <<= 1
            ) {
              for (var val = 0; val < n; ++val) {
                if (lengths[val] === len) {
                  var code2 = 0;
                  var t = code;

                  for (i = 0; i < len; ++i) {
                    code2 = (code2 << 1) | (t & 1);
                    t >>= 1;
                  }

                  for (i = code2; i < size; i += skip) {
                    codes[i] = (len << 16) | val;
                  }

                  ++code;
                }
              }
            }

            return [codes, maxLen];
          };

}
