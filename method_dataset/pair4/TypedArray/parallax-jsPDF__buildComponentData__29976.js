          function buildComponentData(frame, component) {
            var blocksPerLine = component.blocksPerLine;
            var blocksPerColumn = component.blocksPerColumn;
            var computationBuffer = new Int16Array(64);

            for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
              for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
                var offset = getBlockBufferOffset(
                  component,
                  blockRow,
                  blockCol
                );
                quantizeAndInverse(component, offset, computationBuffer);
              }
            }

            return component.blockData;
          }
