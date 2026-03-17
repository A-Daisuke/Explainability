class __C__ {
	constructor(vertex_size, vertex_per_obj) {
		// the size of one vertex in float
		this.vertexSize = vertex_size;
		// size of an object in vertex
		this.objSize = vertex_per_obj;
		// the maximum number of vertices the vertex array buffer can hold
		this.maxVertex = 256; // (note: this seems to be the sweet spot performance-wise when using batching)
		// the current number of vertices added to the vertex array buffer
		this.vertexCount = 0;

		// the actual vertex data buffer
		this.buffer = new ArrayBuffer(
			this.maxVertex * this.vertexSize * this.objSize,
		);
		// Float32 and Uint32 view of the vertex data array buffer
		this.bufferF32 = new Float32Array(this.buffer);
		this.bufferU32 = new Uint32Array(this.buffer);
	}

}
