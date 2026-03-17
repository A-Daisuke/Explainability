const __obj__ = {
            compileFDSelect: function CFFCompiler_compileFDSelect(fdSelect) {
              var format = fdSelect.format;
              var out, i;

              switch (format) {
                case 0:
                  out = new Uint8Array(1 + fdSelect.fdSelect.length);
                  out[0] = format;

                  for (i = 0; i < fdSelect.fdSelect.length; i++) {
                    out[i + 1] = fdSelect.fdSelect[i];
                  }

                  break;

                case 3:
                  var start = 0;
                  var lastFD = fdSelect.fdSelect[0];
                  var ranges = [
                    format,
                    0,
                    0,
                    (start >> 8) & 0xff,
                    start & 0xff,
                    lastFD
                  ];

                  for (i = 1; i < fdSelect.fdSelect.length; i++) {
                    var currentFD = fdSelect.fdSelect[i];

                    if (currentFD !== lastFD) {
                      ranges.push((i >> 8) & 0xff, i & 0xff, currentFD);
                      lastFD = currentFD;
                    }
                  }

                  var numRanges = (ranges.length - 3) / 3;
                  ranges[1] = (numRanges >> 8) & 0xff;
                  ranges[2] = numRanges & 0xff;
                  ranges.push((i >> 8) & 0xff, i & 0xff);
                  out = new Uint8Array(ranges);
                  break;
              }

              return this.compileTypedArray(out);
            },

};
