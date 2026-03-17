function __method_wrapper__() {
	resize(vertexCount) {
		while (vertexCount > this.maxVertex) {
			// double the vertex size
			this.maxVertex <<= 1;
		}

		// save a reference to the previous data
		const data = this.bufferF32;

		// recreate ArrayBuffer and views
		this.buffer = new ArrayBuffer(
			this.maxVertex * this.vertexSize * this.objSize,
		);
		this.bufferF32 = new Float32Array(this.buffer);
		this.bufferU32 = new Uint32Array(this.buffer);

		// copy previous data
		this.bufferF32.set(data);

		return this;
	}

}
