            function InclusionTree(width, height, defaultValue) {
              var levelsLength = (0, _util.log2)(Math.max(width, height)) + 1;
              this.levels = [];

              for (var i = 0; i < levelsLength; i++) {
                var items = new Uint8Array(width * height);

                for (var j = 0, jj = items.length; j < jj; j++) {
                  items[j] = defaultValue;
                }

                var level = {
                  width: width,
                  height: height,
                  items: items
                };
                this.levels.push(level);
                width = Math.ceil(width / 2);
                height = Math.ceil(height / 2);
              }
            }
