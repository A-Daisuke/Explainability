const __obj__ = {
                value: function getRgbBuffer(
                  src,
                  srcOffset,
                  count,
                  dest,
                  destOffset,
                  bits,
                  alpha01
                ) {
                  var tintFn = this.tintFn;
                  var base = this.base;
                  var scale = 1 / ((1 << bits) - 1);
                  var baseNumComps = base.numComps;
                  var usesZeroToOneRange = base.usesZeroToOneRange;
                  var isPassthrough =
                    (base.isPassthrough(8) || !usesZeroToOneRange) &&
                    alpha01 === 0;
                  var pos = isPassthrough ? destOffset : 0;
                  var baseBuf = isPassthrough
                    ? dest
                    : new Uint8ClampedArray(baseNumComps * count);
                  var numComps = this.numComps;
                  var scaled = new Float32Array(numComps);
                  var tinted = new Float32Array(baseNumComps);
                  var i, j;

                  for (i = 0; i < count; i++) {
                    for (j = 0; j < numComps; j++) {
                      scaled[j] = src[srcOffset++] * scale;
                    }

                    tintFn(scaled, 0, tinted, 0);

                    if (usesZeroToOneRange) {
                      for (j = 0; j < baseNumComps; j++) {
                        baseBuf[pos++] = tinted[j] * 255;
                      }
                    } else {
                      base.getRgbItem(tinted, 0, baseBuf, pos);
                      pos += baseNumComps;
                    }
                  }

                  if (!isPassthrough) {
                    base.getRgbBuffer(
                      baseBuf,
                      0,
                      count,
                      dest,
                      destOffset,
                      8,
                      alpha01
                    );
                  }
                }

};
