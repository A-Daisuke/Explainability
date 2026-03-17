class __C__ {
	addQuad(texture, x, y, w, h, u0, v0, u1, v1, tint, reupload = false) {
		const vertexData = this.vertexData;

		if (vertexData.isFull(6)) {
			// is the vertex buffer full if we add 6 more vertices
			this.flush();
		}

		// upload and activate the texture if necessary
		const unit = this.uploadTexture(texture, w, h, reupload);

		// set fragment sampler accordingly
		this.currentShader.setUniform("uSampler", unit);

		// Transform vertices
		const m = this.viewMatrix;
		const vec0 = V_ARRAY[0].set(x, y);
		const vec1 = V_ARRAY[1].set(x + w, y);
		const vec2 = V_ARRAY[2].set(x, y + h);
		const vec3 = V_ARRAY[3].set(x + w, y + h);

		if (!m.isIdentity()) {
			m.apply(vec0);
			m.apply(vec1);
			m.apply(vec2);
			m.apply(vec3);
		}

		vertexData.push(vec0.x, vec0.y, u0, v0, tint);
		vertexData.push(vec1.x, vec1.y, u1, v0, tint);
		vertexData.push(vec2.x, vec2.y, u0, v1, tint);
		vertexData.push(vec2.x, vec2.y, u0, v1, tint);
		vertexData.push(vec1.x, vec1.y, u1, v0, tint);
		vertexData.push(vec3.x, vec3.y, u1, v1, tint);
	}

}
