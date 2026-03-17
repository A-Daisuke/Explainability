          function expand(task) {
            var bounds = task._bounds;
            var viewport = task._viewport;
            var expanded = expandBounds(
              viewport.width,
              viewport.height,
              bounds
            );

            for (var i = 0; i < expanded.length; i++) {
              var div = bounds[i].div;

              var divProperties = task._textDivProperties.get(div);

              if (divProperties.angle === 0) {
                divProperties.paddingLeft = bounds[i].left - expanded[i].left;
                divProperties.paddingTop = bounds[i].top - expanded[i].top;
                divProperties.paddingRight =
                  expanded[i].right - bounds[i].right;
                divProperties.paddingBottom =
                  expanded[i].bottom - bounds[i].bottom;

                task._textDivProperties.set(div, divProperties);

                continue;
              }

              var e = expanded[i],
                b = bounds[i];
              var m = b.m,
                c = m[0],
                s = m[1];
              var points = [[0, 0], [0, b.size[1]], [b.size[0], 0], b.size];
              var ts = new Float64Array(64);
              points.forEach(function(p, i) {
                var t = _util.Util.applyTransform(p, m);

                ts[i + 0] = c && (e.left - t[0]) / c;
                ts[i + 4] = s && (e.top - t[1]) / s;
                ts[i + 8] = c && (e.right - t[0]) / c;
                ts[i + 12] = s && (e.bottom - t[1]) / s;
                ts[i + 16] = s && (e.left - t[0]) / -s;
                ts[i + 20] = c && (e.top - t[1]) / c;
                ts[i + 24] = s && (e.right - t[0]) / -s;
                ts[i + 28] = c && (e.bottom - t[1]) / c;
                ts[i + 32] = c && (e.left - t[0]) / -c;
                ts[i + 36] = s && (e.top - t[1]) / -s;
                ts[i + 40] = c && (e.right - t[0]) / -c;
                ts[i + 44] = s && (e.bottom - t[1]) / -s;
                ts[i + 48] = s && (e.left - t[0]) / s;
                ts[i + 52] = c && (e.top - t[1]) / -c;
                ts[i + 56] = s && (e.right - t[0]) / s;
                ts[i + 60] = c && (e.bottom - t[1]) / -c;
              });

              var findPositiveMin = function findPositiveMin(
                ts,
                offset,
                count
              ) {
                var result = 0;

                for (var i = 0; i < count; i++) {
                  var t = ts[offset++];

                  if (t > 0) {
                    result = result ? Math.min(t, result) : t;
                  }
                }

                return result;
              };

              var boxScale = 1 + Math.min(Math.abs(c), Math.abs(s));
              divProperties.paddingLeft =
                findPositiveMin(ts, 32, 16) / boxScale;
              divProperties.paddingTop = findPositiveMin(ts, 48, 16) / boxScale;
              divProperties.paddingRight =
                findPositiveMin(ts, 0, 16) / boxScale;
              divProperties.paddingBottom =
                findPositiveMin(ts, 16, 16) / boxScale;

              task._textDivProperties.set(div, divProperties);
            }
          }
