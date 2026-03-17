          function decodeType5Shading(mesh, reader, verticesPerRow) {
            var coords = mesh.coords;
            var colors = mesh.colors;
            var ps = [];

            while (reader.hasData) {
              var coord = reader.readCoordinate();
              var color = reader.readComponents();
              ps.push(coords.length);
              coords.push(coord);
              colors.push(color);
            }

            mesh.figures.push({
              type: "lattice",
              coords: new Int32Array(ps),
              colors: new Int32Array(ps),
              verticesPerRow: verticesPerRow
            });
          }
