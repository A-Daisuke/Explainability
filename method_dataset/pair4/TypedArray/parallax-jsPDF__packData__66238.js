          function packData(mesh) {
            var i, ii, j, jj;
            var coords = mesh.coords;
            var coordsPacked = new Float32Array(coords.length * 2);

            for (i = 0, j = 0, ii = coords.length; i < ii; i++) {
              var xy = coords[i];
              coordsPacked[j++] = xy[0];
              coordsPacked[j++] = xy[1];
            }

            mesh.coords = coordsPacked;
            var colors = mesh.colors;
            var colorsPacked = new Uint8Array(colors.length * 3);

            for (i = 0, j = 0, ii = colors.length; i < ii; i++) {
              var c = colors[i];
              colorsPacked[j++] = c[0];
              colorsPacked[j++] = c[1];
              colorsPacked[j++] = c[2];
            }

            mesh.colors = colorsPacked;
            var figures = mesh.figures;

            for (i = 0, ii = figures.length; i < ii; i++) {
              var figure = figures[i],
                ps = figure.coords,
                cs = figure.colors;

              for (j = 0, jj = ps.length; j < jj; j++) {
                ps[j] *= 2;
                cs[j] *= 3;
              }
            }
          }
