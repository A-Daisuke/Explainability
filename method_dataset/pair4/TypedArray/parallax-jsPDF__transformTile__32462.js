          function transformTile(context, tile, c) {
            var component = tile.components[c];
            var codingStyleParameters = component.codingStyleParameters;
            var quantizationParameters = component.quantizationParameters;
            var decompositionLevelsCount =
              codingStyleParameters.decompositionLevelsCount;
            var spqcds = quantizationParameters.SPqcds;
            var scalarExpounded = quantizationParameters.scalarExpounded;
            var guardBits = quantizationParameters.guardBits;
            var segmentationSymbolUsed =
              codingStyleParameters.segmentationSymbolUsed;
            var precision = context.components[c].precision;
            var reversible = codingStyleParameters.reversibleTransformation;
            var transform = reversible
              ? new ReversibleTransform()
              : new IrreversibleTransform();
            var subbandCoefficients = [];
            var b = 0;

            for (var i = 0; i <= decompositionLevelsCount; i++) {
              var resolution = component.resolutions[i];
              var width = resolution.trx1 - resolution.trx0;
              var height = resolution.try1 - resolution.try0;
              var coefficients = new Float32Array(width * height);

              for (var j = 0, jj = resolution.subbands.length; j < jj; j++) {
                var mu, epsilon;

                if (!scalarExpounded) {
                  mu = spqcds[0].mu;
                  epsilon = spqcds[0].epsilon + (i > 0 ? 1 - i : 0);
                } else {
                  mu = spqcds[b].mu;
                  epsilon = spqcds[b].epsilon;
                  b++;
                }

                var subband = resolution.subbands[j];
                var gainLog2 = SubbandsGainLog2[subband.type];
                var delta = reversible
                  ? 1
                  : Math.pow(2, precision + gainLog2 - epsilon) *
                    (1 + mu / 2048);
                var mb = guardBits + epsilon - 1;
                copyCoefficients(
                  coefficients,
                  width,
                  height,
                  subband,
                  delta,
                  mb,
                  reversible,
                  segmentationSymbolUsed
                );
              }

              subbandCoefficients.push({
                width: width,
                height: height,
                items: coefficients
              });
            }

            var result = transform.calculate(
              subbandCoefficients,
              component.tcx0,
              component.tcy0
            );
            return {
              left: component.tcx0,
              top: component.tcy0,
              width: result.width,
              height: result.height,
              items: result.items
            };
          }
