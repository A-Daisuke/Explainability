          function ResolutionPositionComponentLayerIterator(context) {
            var siz = context.SIZ;
            var tileIndex = context.currentTile.index;
            var tile = context.tiles[tileIndex];
            var layersCount = tile.codingStyleDefaultParameters.layersCount;
            var componentsCount = siz.Csiz;
            var l, r, c, p;
            var maxDecompositionLevelsCount = 0;

            for (c = 0; c < componentsCount; c++) {
              var component = tile.components[c];
              maxDecompositionLevelsCount = Math.max(
                maxDecompositionLevelsCount,
                component.codingStyleParameters.decompositionLevelsCount
              );
            }

            var maxNumPrecinctsInLevel = new Int32Array(
              maxDecompositionLevelsCount + 1
            );

            for (r = 0; r <= maxDecompositionLevelsCount; ++r) {
              var maxNumPrecincts = 0;

              for (c = 0; c < componentsCount; ++c) {
                var resolutions = tile.components[c].resolutions;

                if (r < resolutions.length) {
                  maxNumPrecincts = Math.max(
                    maxNumPrecincts,
                    resolutions[r].precinctParameters.numprecincts
                  );
                }
              }

              maxNumPrecinctsInLevel[r] = maxNumPrecincts;
            }

            l = 0;
            r = 0;
            c = 0;
            p = 0;

            this.nextPacket = function JpxImage_nextPacket() {
              for (; r <= maxDecompositionLevelsCount; r++) {
                for (; p < maxNumPrecinctsInLevel[r]; p++) {
                  for (; c < componentsCount; c++) {
                    var component = tile.components[c];

                    if (
                      r >
                      component.codingStyleParameters.decompositionLevelsCount
                    ) {
                      continue;
                    }

                    var resolution = component.resolutions[r];
                    var numprecincts =
                      resolution.precinctParameters.numprecincts;

                    if (p >= numprecincts) {
                      continue;
                    }

                    for (; l < layersCount; ) {
                      var packet = createPacket(resolution, p, l);
                      l++;
                      return packet;
                    }

                    l = 0;
                  }

                  c = 0;
                }

                p = 0;
              }

              throw new JpxError("Out of packets");
            };
          }
