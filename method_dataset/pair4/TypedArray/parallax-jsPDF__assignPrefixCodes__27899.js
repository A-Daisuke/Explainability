const __obj__ = {
            assignPrefixCodes: function assignPrefixCodes(lines) {
              var linesLength = lines.length,
                prefixLengthMax = 0,
                i;

              for (i = 0; i < linesLength; i++) {
                prefixLengthMax = Math.max(
                  prefixLengthMax,
                  lines[i].prefixLength
                );
              }

              var histogram = new Uint32Array(prefixLengthMax + 1);

              for (i = 0; i < linesLength; i++) {
                histogram[lines[i].prefixLength]++;
              }

              var currentLength = 1,
                firstCode = 0,
                currentCode,
                currentTemp,
                line;
              histogram[0] = 0;

              while (currentLength <= prefixLengthMax) {
                firstCode = (firstCode + histogram[currentLength - 1]) << 1;
                currentCode = firstCode;
                currentTemp = 0;

                while (currentTemp < linesLength) {
                  line = lines[currentTemp];

                  if (line.prefixLength === currentLength) {
                    line.prefixCode = currentCode;
                    currentCode++;
                  }

                  currentTemp++;
                }

                currentLength++;
              }
            }

};
