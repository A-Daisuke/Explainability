          function initSmaskGL() {
            var canvas, gl;
            generateGL();
            canvas = currentCanvas;
            currentCanvas = null;
            gl = currentGL;
            currentGL = null;
            var vertexShader = createVertexShader(gl, smaskVertexShaderCode);
            var fragmentShader = createFragmentShader(
              gl,
              smaskFragmentShaderCode
            );
            var program = createProgram(gl, [vertexShader, fragmentShader]);
            gl.useProgram(program);
            var cache = {};
            cache.gl = gl;
            cache.canvas = canvas;
            cache.resolutionLocation = gl.getUniformLocation(
              program,
              "u_resolution"
            );
            cache.positionLocation = gl.getAttribLocation(
              program,
              "a_position"
            );
            cache.backdropLocation = gl.getUniformLocation(
              program,
              "u_backdrop"
            );
            cache.subtypeLocation = gl.getUniformLocation(program, "u_subtype");
            var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
            var texLayerLocation = gl.getUniformLocation(program, "u_image");
            var texMaskLocation = gl.getUniformLocation(program, "u_mask");
            var texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                1.0,
                1.0,
                0.0,
                1.0,
                1.0
              ]),
              gl.STATIC_DRAW
            );
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.uniform1i(texLayerLocation, 0);
            gl.uniform1i(texMaskLocation, 1);
            smaskCache = cache;
          }
