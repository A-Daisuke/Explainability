function __method_wrapper__() {
	constructor(tileset) {
		// tile properties (collidable, etc..)
		this.TileProperties = [];

		// hold reference to each tile image
		this.imageCollection = [];

		this.firstgid = this.lastgid = +tileset.firstgid;

		// check if an external tileset is defined
		if (typeof tileset.source !== "undefined") {
			const src = tileset.source;
			const ext = getExtension(src);
			if (ext === "tsx" || ext === "json") {
				// load the external tileset (TSX/JSON)
				tileset = getTMX(getBasename(src));
				if (!tileset) {
					throw new Error(src + " external TSX/JSON tileset not found");
				}
			}
		}

		this.name = tileset.name;
		this.tilewidth = +tileset.tilewidth;
		this.tileheight = +tileset.tileheight;
		this.spacing = +tileset.spacing || 0;
		this.margin = +tileset.margin || 0;

		// set tile offset properties (if any)
		this.tileoffset = new Vector2d();

		/**
		 * Tileset contains animated tiles
		 * @type {boolean}
		 */
		this.isAnimated = false;

		/**
		 * true if the tileset is a "Collection of Image" Tileset
		 * @type {boolean}
		 */
		this.isCollection = false;

		/**
		 * the tileset class
		 * @type {boolean}
		 */
		this.class = tileset.class;

		/**
		 * Tileset animations
		 * @private
		 */
		this.animations = new Map();

		/**
		 * Remember the last update timestamp to prevent too many animation updates
		 * @private
		 */
		this._lastUpdate = 0;

		const tiles = tileset.tiles;
		for (const i in tiles) {
			if (tiles.hasOwnProperty(i)) {
				if ("animation" in tiles[i]) {
					this.isAnimated = true;
					this.animations.set(tiles[+i].animation[0].tileid, {
						dt: 0,
						idx: 0,
						frames: tiles[+i].animation,
						cur: tiles[+i].animation[0],
					});
				}
				// set tile properties, if any
				if ("properties" in tiles[i]) {
					if (Array.isArray(tiles[i].properties)) {
						// JSON (new format)
						const tileProperty = {};
						for (const j in tiles[i].properties) {
							tileProperty[tiles[i].properties[j].name] =
								tiles[i].properties[j].value;
						}
						this.setTileProperty(+tiles[i].id + this.firstgid, tileProperty);
					} else {
						// XML format
						this.setTileProperty(+i + this.firstgid, tiles[i].properties);
					}
				}
				if ("image" in tiles[i]) {
					const image = getImage(tiles[i].image);
					if (!image) {
						throw new Error(
							"melonJS: '" +
								tiles[i].image +
								"' file for tile '" +
								(+i + this.firstgid) +
								"' not found!",
						);
					}
					this.imageCollection[+i + this.firstgid] = image;
				}
			}
		}

		this.isCollection = this.imageCollection.length > 0;

		const offset = tileset.tileoffset;
		if (offset) {
			this.tileoffset.x = +offset.x;
			this.tileoffset.y = +offset.y;
		}

		// set tile properties, if any (JSON old format)
		const tileInfo = tileset.tileproperties;
		if (tileInfo) {
			for (const i in tileInfo) {
				if (tileInfo.hasOwnProperty(i)) {
					this.setTileProperty(+i + this.firstgid, tileInfo[i]);
				}
			}
		}

		// if not a tile image collection
		if (this.isCollection === false) {
			// get the global tileset texture
			this.image = getImage(tileset.image);

			if (!this.image) {
				throw new Error(
					"melonJS: '" +
						tileset.image +
						"' file for tileset '" +
						this.name +
						"' not found!",
				);
			}

			// create a texture atlas for the given tileset
			this.texture = renderer.cache.get(this.image, {
				framewidth: this.tilewidth,
				frameheight: this.tileheight,
				margin: this.margin,
				spacing: this.spacing,
			});
			this.atlas = this.texture.getAtlas();

			// calculate the number of tiles per horizontal line
			const hTileCount =
				+tileset.columns ||
				Math.round(this.image.width / (this.tilewidth + this.spacing));
			let vTileCount = Math.round(
				this.image.height / (this.tileheight + this.spacing),
			);
			if (tileset.tilecount % hTileCount > 0) {
				++vTileCount;
			}
			// compute the last gid value in the tileset
			this.lastgid = this.firstgid + (hTileCount * vTileCount - 1 || 0);
			if (
				tileset.tilecount &&
				this.lastgid - this.firstgid + 1 !== +tileset.tilecount
			) {
				console.warn(
					"Computed tilecount (" +
						(this.lastgid - this.firstgid + 1) +
						") does not match expected tilecount (" +
						tileset.tilecount +
						")",
				);
			}
		}
	}

}
