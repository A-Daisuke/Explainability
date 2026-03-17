    function initShader() {
      const canvas = canvasRef.current;
      const gl = canvas?.getContext('webgl2', {
        antialias: true,
        alpha: true
      });
      if (!canvas || !gl) {
        return;
      }

      function createShader(gl: WebGL2RenderingContext, sourceCode: string, type: number) {
        const shader = gl.createShader(type);
        if (!shader) {
          return null;
        }

        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      }

      const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
      const fragmentShader = createShader(gl, liquidFragSource, gl.FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!program || !vertexShader || !fragmentShader) {
        return;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
      }

      function getUniforms(program: WebGLProgram, gl: WebGL2RenderingContext) {
        let uniforms: Record<string, WebGLUniformLocation> = {};
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
          let uniformName = gl.getActiveUniform(program, i)?.name;
          if (!uniformName) continue;
          uniforms[uniformName] = gl.getUniformLocation(program, uniformName) as WebGLUniformLocation;
        }
        return uniforms;
      }
      const uniforms = getUniforms(program, gl);
      setUniforms(uniforms);

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      gl.useProgram(program);

      const positionLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      setGl(gl);
    }
