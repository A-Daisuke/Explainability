function __method_wrapper__() {
    _updateBuffers() {
      if (!this._light) {
        return;
      }
      this._center[0] = this._object.x;
      this._center[1] = this._object.y;
      const vertices = this._computeLightVertices();

      // Fallback to simple quad when there are no obstacles around.
      if (vertices.length === 0) {
        this._defaultVertexBuffer[0] = this._object.x - this._radius;
        this._defaultVertexBuffer[1] = this._object.y + this._radius;
        this._defaultVertexBuffer[2] = this._object.x + this._radius;
        this._defaultVertexBuffer[3] = this._object.y + this._radius;
        this._defaultVertexBuffer[4] = this._object.x + this._radius;
        this._defaultVertexBuffer[5] = this._object.y - this._radius;
        this._defaultVertexBuffer[6] = this._object.x - this._radius;
        this._defaultVertexBuffer[7] = this._object.y - this._radius;
        this._light.shader.uniforms.center = this._center;
        this._light.geometry
          .getBuffer('aVertexPosition')
          .update(this._defaultVertexBuffer);
        this._light.geometry
          .getIndex()
          .update(LightRuntimeObjectPixiRenderer._defaultIndexBuffer);
        return;
      }
      const verticesCount = vertices.length;

      // If the array buffer which is already allocated is at most
      // twice the size of memory required, we could avoid re-allocation
      // and instead use a subarray. Otherwise, allocate new array buffers as
      // there would be memory wastage.
      let isSubArrayUsed = false;
      let vertexBufferSubArray: Float32Array | null = null;
      let indexBufferSubArray: Uint16Array | null = null;
      if (this._vertexBuffer.length > 2 * verticesCount + 2) {
        if (this._vertexBuffer.length < 4 * verticesCount + 4) {
          isSubArrayUsed = true;
          vertexBufferSubArray = this._vertexBuffer.subarray(
            0,
            2 * verticesCount + 2
          );
          indexBufferSubArray = this._indexBuffer.subarray(
            0,
            3 * verticesCount
          );
        } else {
          this._vertexBuffer = new Float32Array(2 * verticesCount + 2);
          this._indexBuffer = new Uint16Array(3 * verticesCount);
        }
      }

      // When the allocated array buffer has less memory than
      // required, we'll have to allocated new array buffers.
      if (this._vertexBuffer.length < 2 * verticesCount + 2) {
        this._vertexBuffer = new Float32Array(2 * verticesCount + 2);
        this._indexBuffer = new Uint16Array(3 * verticesCount);
      }
      this._vertexBuffer[0] = this._object.x;
      this._vertexBuffer[1] = this._object.y;
      for (let i = 2; i < 2 * verticesCount + 2; i += 2) {
        this._vertexBuffer[i] = vertices[i / 2 - 1][0];
        this._vertexBuffer[i + 1] = vertices[i / 2 - 1][1];
      }
      for (let i = 0; i < 3 * verticesCount; i += 3) {
        this._indexBuffer[i] = 0;
        this._indexBuffer[i + 1] = i / 3 + 1;
        if (i / 3 + 1 !== verticesCount) {
          this._indexBuffer[i + 2] = i / 3 + 2;
        } else {
          this._indexBuffer[i + 2] = 1;
        }
      }
      this._light.shader.uniforms.center = this._center;
      if (!isSubArrayUsed) {
        this._light.geometry
          .getBuffer('aVertexPosition')
          .update(this._vertexBuffer);
        this._light.geometry.getIndex().update(this._indexBuffer);
      } else {
        this._light.geometry
          .getBuffer('aVertexPosition')
          // @ts-ignore
          .update(vertexBufferSubArray);
        // @ts-ignore
        this._light.geometry.getIndex().update(indexBufferSubArray);
      }
    }

}
