function __method_wrapper__() {
  private initDiscInstances(count: number): void {
    if (!this.gl || !this.discVAO) return;
    const gl = this.gl;

    const matricesArray = new Float32Array(count * 16);
    const matrices: Float32Array[] = [];
    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(matricesArray.buffer, i * 16 * 4, 16);
      mat4.identity(instanceMatrixArray as unknown as mat4);
      matrices.push(instanceMatrixArray);
    }

    this.discInstances = {
      matricesArray,
      matrices,
      buffer: gl.createBuffer()
    };

    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);

    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

}
