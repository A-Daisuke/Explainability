          function transformComponents(context) {
            var siz = context.SIZ;
            var components = context.components;
            var componentsCount = siz.Csiz;
            var resultImages = [];

            for (var i = 0, ii = context.tiles.length; i < ii; i++) {
              var tile = context.tiles[i];
              var transformedTiles = [];
              var c;

              for (c = 0; c < componentsCount; c++) {
                transformedTiles[c] = transformTile(context, tile, c);
              }

              var tile0 = transformedTiles[0];
              var out = new Uint8ClampedArray(
                tile0.items.length * componentsCount
              );
              var result = {
                left: tile0.left,
                top: tile0.top,
                width: tile0.width,
                height: tile0.height,
                items: out
              };
              var shift, offset;
              var pos = 0,
                j,
                jj,
                y0,
                y1,
                y2;

              if (
                tile.codingStyleDefaultParameters.multipleComponentTransform
              ) {
                var fourComponents = componentsCount === 4;
                var y0items = transformedTiles[0].items;
                var y1items = transformedTiles[1].items;
                var y2items = transformedTiles[2].items;
                var y3items = fourComponents ? transformedTiles[3].items : null;
                shift = components[0].precision - 8;
                offset = (128 << shift) + 0.5;
                var component0 = tile.components[0];
                var alpha01 = componentsCount - 3;
                jj = y0items.length;

                if (
                  !component0.codingStyleParameters.reversibleTransformation
                ) {
                  for (j = 0; j < jj; j++, pos += alpha01) {
                    y0 = y0items[j] + offset;
                    y1 = y1items[j];
                    y2 = y2items[j];
                    out[pos++] = (y0 + 1.402 * y2) >> shift;
                    out[pos++] = (y0 - 0.34413 * y1 - 0.71414 * y2) >> shift;
                    out[pos++] = (y0 + 1.772 * y1) >> shift;
                  }
                } else {
                  for (j = 0; j < jj; j++, pos += alpha01) {
                    y0 = y0items[j] + offset;
                    y1 = y1items[j];
                    y2 = y2items[j];
                    var g = y0 - ((y2 + y1) >> 2);
                    out[pos++] = (g + y2) >> shift;
                    out[pos++] = g >> shift;
                    out[pos++] = (g + y1) >> shift;
                  }
                }

                if (fourComponents) {
                  for (j = 0, pos = 3; j < jj; j++, pos += 4) {
                    out[pos] = (y3items[j] + offset) >> shift;
                  }
                }
              } else {
                for (c = 0; c < componentsCount; c++) {
                  var items = transformedTiles[c].items;
                  shift = components[c].precision - 8;
                  offset = (128 << shift) + 0.5;

                  for (pos = c, j = 0, jj = items.length; j < jj; j++) {
                    out[pos] = (items[j] + offset) >> shift;
                    pos += componentsCount;
                  }
                }
              }

              resultImages.push(result);
            }

            return resultImages;
          }
