          function decodeType4Shading(mesh, reader) {
            var coords = mesh.coords;
            var colors = mesh.colors;
            var operators = [];
            var ps = [];
            var verticesLeft = 0;

            while (reader.hasData) {
              var f = reader.readFlag();
              var coord = reader.readCoordinate();
              var color = reader.readComponents();

              if (verticesLeft === 0) {
                if (!(0 <= f && f <= 2)) {
                  throw new _util.FormatError("Unknown type4 flag");
                }

                switch (f) {
                  case 0:
                    verticesLeft = 3;
                    break;

                  case 1:
                    ps.push(ps[ps.length - 2], ps[ps.length - 1]);
                    verticesLeft = 1;
                    break;

                  case 2:
                    ps.push(ps[ps.length - 3], ps[ps.length - 1]);
                    verticesLeft = 1;
                    break;
                }

                operators.push(f);
              }

              ps.push(coords.length);
              coords.push(coord);
              colors.push(color);
              verticesLeft--;
              reader.align();
            }

            mesh.figures.push({
              type: "triangles",
              coords: new Int32Array(ps),
              colors: new Int32Array(ps)
            });
          }
