function __method_wrapper__() {
  static from(
    editableTileMapAsJsObject: EditableTileMapAsJsObject,
    {
      tileSize,
      tileSetColumnCount,
      tileSetRowCount,
    }: {
      tileSize: number;
      tileSetColumnCount: number;
      tileSetRowCount: number;
    }
  ): EditableTileMap {
    const tileSet = new Map<number, TileDefinition>();

    if (
      !Number.isInteger(tileSetColumnCount) ||
      tileSetColumnCount <= 0 ||
      !Number.isInteger(tileSetRowCount) ||
      tileSetRowCount <= 0
    ) {
      throw new Error(
        `Tilemap object badly configured. Tile size ${tileSize} is not compatible with atlas image dimensions, resulting in having ${tileSetColumnCount} columns and ${tileSetRowCount} rows.`
      );
    }
    // TODO: Actually save and load tile set when useful.
    new Array(tileSetColumnCount * tileSetRowCount)
      .fill(0)
      .forEach((_, index) => {
        tileSet.set(index, new TileDefinition(0));
      });

    const tileMap = new EditableTileMap(
      tileSize || editableTileMapAsJsObject.tileWidth,
      tileSize || editableTileMapAsJsObject.tileHeight,
      editableTileMapAsJsObject.dimX || 1,
      editableTileMapAsJsObject.dimY || 1,
      tileSet
    );

    if (editableTileMapAsJsObject.layers) {
      editableTileMapAsJsObject.layers.forEach((layerAsJsObject: any) => {
        tileMap.addTileLayer(
          EditableTileMapLayer.from(
            layerAsJsObject,
            tileMap,
            (tileId) => tileId < tileSetColumnCount * tileSetRowCount
          )
        );
      });
    } else {
      tileMap.addNewTileLayer(0);
    }

    return tileMap;
  }

}
