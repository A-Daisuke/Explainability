          function drawFigures(
            width,
            height,
            backgroundColor,
            figures,
            context
          ) {
            if (!figuresCache) {
              initFiguresGL();
            }

            var cache = figuresCache,
              canvas = cache.canvas,
              gl = cache.gl;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.uniform2f(cache.resolutionLocation, width, height);
            var count = 0;
            var i, ii, rows;

            for (i = 0, ii = figures.length; i < ii; i++) {
              switch (figures[i].type) {
                case "lattice":
                  rows =
                    (figures[i].coords.length / figures[i].verticesPerRow) | 0;
                  count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
                  break;

                case "triangles":
                  count += figures[i].coords.length;
                  break;
              }
            }

            var coords = new Float32Array(count * 2);
            var colors = new Uint8Array(count * 3);
            var coordsMap = context.coords,
              colorsMap = context.colors;
            var pIndex = 0,
              cIndex = 0;

            for (i = 0, ii = figures.length; i < ii; i++) {
              var figure = figures[i],
                ps = figure.coords,
                cs = figure.colors;

              switch (figure.type) {
                case "lattice":
                  var cols = figure.verticesPerRow;
                  rows = (ps.length / cols) | 0;

                  for (var row = 1; row < rows; row++) {
                    var offset = row * cols + 1;

                    for (var col = 1; col < cols; col++, offset++) {
                      coords[pIndex] = coordsMap[ps[offset - cols - 1]];
                      coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
                      coords[pIndex + 2] = coordsMap[ps[offset - cols]];
                      coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
                      coords[pIndex + 4] = coordsMap[ps[offset - 1]];
                      coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
                      colors[cIndex] = colorsMap[cs[offset - cols - 1]];
                      colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
                      colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
                      colors[cIndex + 3] = colorsMap[cs[offset - cols]];
                      colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
                      colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
                      colors[cIndex + 6] = colorsMap[cs[offset - 1]];
                      colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
                      colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];
                      coords[pIndex + 6] = coords[pIndex + 2];
                      coords[pIndex + 7] = coords[pIndex + 3];
                      coords[pIndex + 8] = coords[pIndex + 4];
                      coords[pIndex + 9] = coords[pIndex + 5];
                      coords[pIndex + 10] = coordsMap[ps[offset]];
                      coords[pIndex + 11] = coordsMap[ps[offset] + 1];
                      colors[cIndex + 9] = colors[cIndex + 3];
                      colors[cIndex + 10] = colors[cIndex + 4];
                      colors[cIndex + 11] = colors[cIndex + 5];
                      colors[cIndex + 12] = colors[cIndex + 6];
                      colors[cIndex + 13] = colors[cIndex + 7];
                      colors[cIndex + 14] = colors[cIndex + 8];
                      colors[cIndex + 15] = colorsMap[cs[offset]];
                      colors[cIndex + 16] = colorsMap[cs[offset] + 1];
                      colors[cIndex + 17] = colorsMap[cs[offset] + 2];
                      pIndex += 12;
                      cIndex += 18;
                    }
                  }

                  break;

                case "triangles":
                  for (var j = 0, jj = ps.length; j < jj; j++) {
                    coords[pIndex] = coordsMap[ps[j]];
                    coords[pIndex + 1] = coordsMap[ps[j] + 1];
                    colors[cIndex] = colorsMap[cs[j]];
                    colors[cIndex + 1] = colorsMap[cs[j] + 1];
                    colors[cIndex + 2] = colorsMap[cs[j] + 2];
                    pIndex += 2;
                    cIndex += 3;
                  }

                  break;
              }
            }

            if (backgroundColor) {
              gl.clearColor(
                backgroundColor[0] / 255,
                backgroundColor[1] / 255,
                backgroundColor[2] / 255,
                1.0
              );
            } else {
              gl.clearColor(0, 0, 0, 0);
            }

            gl.clear(gl.COLOR_BUFFER_BIT);
            var coordsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(cache.positionLocation);
            gl.vertexAttribPointer(
              cache.positionLocation,
              2,
              gl.FLOAT,
              false,
              0,
              0
            );
            var colorsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(cache.colorLocation);
            gl.vertexAttribPointer(
              cache.colorLocation,
              3,
              gl.UNSIGNED_BYTE,
              false,
              0,
              0
            );
            gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
            gl.uniform2f(
              cache.offsetLocation,
              context.offsetX,
              context.offsetY
            );
            gl.drawArrays(gl.TRIANGLES, 0, count);
            gl.flush();
            gl.deleteBuffer(coordsBuffer);
            gl.deleteBuffer(colorsBuffer);
            return canvas;
          }
