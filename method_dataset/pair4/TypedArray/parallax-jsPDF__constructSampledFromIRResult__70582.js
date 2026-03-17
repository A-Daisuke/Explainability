function __method_wrapper__() {
              return function constructSampledFromIRResult(
                src,
                srcOffset,
                dest,
                destOffset
              ) {
                var m = IR[1];
                var domain = IR[2];
                var encode = IR[3];
                var decode = IR[4];
                var samples = IR[5];
                var size = IR[6];
                var n = IR[7];
                var range = IR[9];
                var cubeVertices = 1 << m;
                var cubeN = new Float64Array(cubeVertices);
                var cubeVertex = new Uint32Array(cubeVertices);
                var i, j;

                for (j = 0; j < cubeVertices; j++) {
                  cubeN[j] = 1;
                }

                var k = n,
                  pos = 1;

                for (i = 0; i < m; ++i) {
                  var domain_2i = domain[i][0];
                  var domain_2i_1 = domain[i][1];
                  var xi = Math.min(
                    Math.max(src[srcOffset + i], domain_2i),
                    domain_2i_1
                  );
                  var e = interpolate(
                    xi,
                    domain_2i,
                    domain_2i_1,
                    encode[i][0],
                    encode[i][1]
                  );
                  var size_i = size[i];
                  e = Math.min(Math.max(e, 0), size_i - 1);
                  var e0 = e < size_i - 1 ? Math.floor(e) : e - 1;
                  var n0 = e0 + 1 - e;
                  var n1 = e - e0;
                  var offset0 = e0 * k;
                  var offset1 = offset0 + k;

                  for (j = 0; j < cubeVertices; j++) {
                    if (j & pos) {
                      cubeN[j] *= n1;
                      cubeVertex[j] += offset1;
                    } else {
                      cubeN[j] *= n0;
                      cubeVertex[j] += offset0;
                    }
                  }

                  k *= size_i;
                  pos <<= 1;
                }

                for (j = 0; j < n; ++j) {
                  var rj = 0;

                  for (i = 0; i < cubeVertices; i++) {
                    rj += samples[cubeVertex[i] + j] * cubeN[i];
                  }

                  rj = interpolate(rj, 0, 1, decode[j][0], decode[j][1]);
                  dest[destOffset + j] = Math.min(
                    Math.max(rj, range[j][0]),
                    range[j][1]
                  );
                }
              };

}
