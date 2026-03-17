class __C__ {
	addUVs(atlas, name, w, h) {
		// ignore if using the Canvas Renderer
		if (typeof renderer.gl !== "undefined") {
			// Source coordinates
			const s = atlas[name].offset;
			const sw = atlas[name].width;
			const sh = atlas[name].height;

			atlas[name].uvs = new Float32Array([
				s.x / w, // u0 (left)
				s.y / h, // v0 (top)
				(s.x + sw) / w, // u1 (right)
				(s.y + sh) / h, // v1 (bottom)
			]);
			// Cache source coordinates
			// TODO: Remove this when the Batcher only accepts a region name
			const key = s.x + "," + s.y + "," + w + "," + h;
			atlas[key] = atlas[name];
		}
		return atlas[name].uvs;
	}

}
