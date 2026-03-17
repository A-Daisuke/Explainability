            function buildB(count) {
              var lut = [];

              for (var i = 0; i <= count; i++) {
                var t = i / count,
                  t_ = 1 - t;
                lut.push(
                  new Float32Array([
                    t_ * t_ * t_,
                    3 * t * t_ * t_,
                    3 * t * t * t_,
                    t * t * t
                  ])
                );
              }

              return lut;
            }
