              function foldTTTable(table, content) {
                if (content.length > 1) {
                  var newLength = 0;
                  var j, jj;

                  for (j = 0, jj = content.length; j < jj; j++) {
                    newLength += content[j].length;
                  }

                  newLength = (newLength + 3) & ~3;
                  var result = new Uint8Array(newLength);
                  var pos = 0;

                  for (j = 0, jj = content.length; j < jj; j++) {
                    result.set(content[j], pos);
                    pos += content[j].length;
                  }

                  table.data = result;
                  table.length = newLength;
                }
              }
