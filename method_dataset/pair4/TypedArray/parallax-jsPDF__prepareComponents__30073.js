              function prepareComponents(frame) {
                var mcusPerLine = Math.ceil(
                  frame.samplesPerLine / 8 / frame.maxH
                );
                var mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);

                for (var i = 0; i < frame.components.length; i++) {
                  component = frame.components[i];
                  var blocksPerLine = Math.ceil(
                    (Math.ceil(frame.samplesPerLine / 8) * component.h) /
                      frame.maxH
                  );
                  var blocksPerColumn = Math.ceil(
                    (Math.ceil(frame.scanLines / 8) * component.v) / frame.maxV
                  );
                  var blocksPerLineForMcu = mcusPerLine * component.h;
                  var blocksPerColumnForMcu = mcusPerColumn * component.v;
                  var blocksBufferSize =
                    64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
                  component.blockData = new Int16Array(blocksBufferSize);
                  component.blocksPerLine = blocksPerLine;
                  component.blocksPerColumn = blocksPerColumn;
                }

                frame.mcusPerLine = mcusPerLine;
                frame.mcusPerColumn = mcusPerColumn;
              }
