          function composeSMask(layer, mask, properties) {
            var width = layer.width,
              height = layer.height;

            if (!smaskCache) {
              initSmaskGL();
            }

            var cache = smaskCache,
              canvas = cache.canvas,
              gl = cache.gl;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.uniform2f(cache.resolutionLocation, width, height);

            if (properties.backdrop) {
              gl.uniform4f(
                cache.resolutionLocation,
                properties.backdrop[0],
                properties.backdrop[1],
                properties.backdrop[2],
                1
              );
            } else {
              gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
            }

            gl.uniform1i(
              cache.subtypeLocation,
              properties.subtype === "Luminosity" ? 1 : 0
            );
            var texture = createTexture(gl, layer, gl.TEXTURE0);
            var maskTexture = createTexture(gl, mask, gl.TEXTURE1);
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([
                0,
                0,
                width,
                0,
                0,
                height,
                0,
                height,
                width,
                0,
                width,
                height
              ]),
              gl.STATIC_DRAW
            );
            gl.enableVertexAttribArray(cache.positionLocation);
            gl.vertexAttribPointer(
              cache.positionLocation,
              2,
              gl.FLOAT,
              false,
              0,
              0
            );
            gl.clearColor(0, 0, 0, 0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.flush();
            gl.deleteTexture(texture);
            gl.deleteTexture(maskTexture);
            gl.deleteBuffer(buffer);
            return canvas;
          }
