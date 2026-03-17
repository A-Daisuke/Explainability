const __obj__ = {
            constructStichedFromIR: function constructStichedFromIR(_ref11) {
              var xref = _ref11.xref,
                isEvalSupported = _ref11.isEvalSupported,
                IR = _ref11.IR;
              var domain = IR[1];
              var bounds = IR[2];
              var encode = IR[3];
              var fns = IR[4];
              var tmpBuf = new Float32Array(1);
              return function constructStichedFromIRResult(
                src,
                srcOffset,
                dest,
                destOffset
              ) {
                var clip = function constructStichedFromIRClip(v, min, max) {
                  if (v > max) {
                    v = max;
                  } else if (v < min) {
                    v = min;
                  }

                  return v;
                };

                var v = clip(src[srcOffset], domain[0], domain[1]);

                for (var i = 0, ii = bounds.length; i < ii; ++i) {
                  if (v < bounds[i]) {
                    break;
                  }
                }

                var dmin = domain[0];

                if (i > 0) {
                  dmin = bounds[i - 1];
                }

                var dmax = domain[1];

                if (i < bounds.length) {
                  dmax = bounds[i];
                }

                var rmin = encode[2 * i];
                var rmax = encode[2 * i + 1];
                tmpBuf[0] =
                  dmin === dmax
                    ? rmin
                    : rmin + ((v - dmin) * (rmax - rmin)) / (dmax - dmin);
                fns[i](tmpBuf, 0, dest, destOffset);
              };
            },

};
