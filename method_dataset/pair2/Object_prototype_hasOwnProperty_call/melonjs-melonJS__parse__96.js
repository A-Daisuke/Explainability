class __C__ {
	parse(fontData: string) {
		if (!fontData) {
			throw new Error(
				"File containing font data was empty, cannot load the bitmap font.",
			);
		}

		const lines = fontData.split(/\r\n|\n/);
		const padding = fontData.match(/padding=\d+,\d+,\d+,\d+/g);
		if (!padding) {
			throw new Error("Padding not found in first line");
		}
		const paddingValues = padding[0].split("=")[1].split(",");

		this.padTop = parseFloat(paddingValues[0]);
		this.padLeft = parseFloat(paddingValues[1]);
		this.padBottom = parseFloat(paddingValues[2]);
		this.padRight = parseFloat(paddingValues[3]);
		this.lineHeight = parseFloat(getValueFromPair(lines[1], /lineHeight=\d+/g));

		this.capHeight = 1;
		this.descent = 0;
		this.glyphs = {};

		const baseLine = parseFloat(getValueFromPair(lines[1], /base=\d+/g));
		const padY = this.padTop + this.padBottom;

		let glyph: Glyph | null = null;

		for (let i = 4; i < lines.length; i++) {
			const line = lines[i];
			const characterValues = line.split(/=|\s+/);
			if (!line || /^kernings/.test(line)) {
				continue;
			}
			if (/^kerning\s/.test(line)) {
				const first = parseFloat(characterValues[2]);
				const second = parseFloat(characterValues[4]);
				const amount = parseFloat(characterValues[6]);

				glyph = this.glyphs[first];
				if (glyph !== null && typeof glyph !== "undefined") {
					glyph.setKerning(second, amount);
				}
			} else {
				glyph = new Glyph();

				const ch = parseFloat(characterValues[2]);
				glyph.id = ch;
				glyph.x = parseFloat(characterValues[4]);
				glyph.y = parseFloat(characterValues[6]);
				glyph.width = parseFloat(characterValues[8]);
				glyph.height = parseFloat(characterValues[10]);
				glyph.xoffset = parseFloat(characterValues[12]);
				glyph.yoffset = parseFloat(characterValues[14]);
				glyph.xadvance = parseFloat(characterValues[16]);

				if (glyph.width > 0 && glyph.height > 0) {
					this.descent = Math.min(baseLine + glyph.yoffset, this.descent);
				}

				this.glyphs[ch] = glyph;
			}
		}

		this.descent += this.padBottom;

		createSpaceGlyph(this.glyphs);

		let capGlyph: Glyph | null = null;
		for (let i = 0; i < capChars.length; i++) {
			const capChar = capChars[i];
			capGlyph = this.glyphs[capChar.charCodeAt(0)];
			if (capGlyph) {
				break;
			}
		}
		if (!capGlyph) {
			for (const charCode in this.glyphs) {
				if (Object.prototype.hasOwnProperty.call(this.glyphs, charCode)) {
					glyph = this.glyphs[charCode];
					if (glyph.height === 0 || glyph.width === 0) {
						continue;
					}
					this.capHeight = Math.max(this.capHeight, glyph.height);
				}
			}
		} else {
			this.capHeight = capGlyph.height;
		}
		this.capHeight -= padY;
	}

}
