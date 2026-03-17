          function RadialAxial(dict, matrix, xref, res, pdfFunctionFactory) {
            this.matrix = matrix;
            this.coordsArr = dict.getArray("Coords");
            this.shadingType = dict.get("ShadingType");
            this.type = "Pattern";
            var cs = dict.get("ColorSpace", "CS");
            cs = _colorspace.ColorSpace.parse(
              cs,
              xref,
              res,
              pdfFunctionFactory
            );
            this.cs = cs;
            var t0 = 0.0,
              t1 = 1.0;

            if (dict.has("Domain")) {
              var domainArr = dict.getArray("Domain");
              t0 = domainArr[0];
              t1 = domainArr[1];
            }

            var extendStart = false,
              extendEnd = false;

            if (dict.has("Extend")) {
              var extendArr = dict.getArray("Extend");
              extendStart = extendArr[0];
              extendEnd = extendArr[1];
            }

            if (
              this.shadingType === ShadingType.RADIAL &&
              (!extendStart || !extendEnd)
            ) {
              var x1 = this.coordsArr[0];
              var y1 = this.coordsArr[1];
              var r1 = this.coordsArr[2];
              var x2 = this.coordsArr[3];
              var y2 = this.coordsArr[4];
              var r2 = this.coordsArr[5];
              var distance = Math.sqrt(
                (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
              );

              if (r1 <= r2 + distance && r2 <= r1 + distance) {
                (0, _util.warn)("Unsupported radial gradient.");
              }
            }

            this.extendStart = extendStart;
            this.extendEnd = extendEnd;
            var fnObj = dict.get("Function");
            var fn = pdfFunctionFactory.createFromArray(fnObj);
            var diff = t1 - t0;
            var step = diff / 10;
            var colorStops = (this.colorStops = []);

            if (t0 >= t1 || step <= 0) {
              (0, _util.info)("Bad shading domain.");
              return;
            }

            var color = new Float32Array(cs.numComps),
              ratio = new Float32Array(1);
            var rgbColor;

            for (var i = t0; i <= t1; i += step) {
              ratio[0] = i;
              fn(ratio, 0, color, 0);
              rgbColor = cs.getRgb(color, 0);

              var cssColor = _util.Util.makeCssRgb(
                rgbColor[0],
                rgbColor[1],
                rgbColor[2]
              );

              colorStops.push([(i - t0) / diff, cssColor]);
            }

            var background = "transparent";

            if (dict.has("Background")) {
              rgbColor = cs.getRgb(dict.get("Background"), 0);
              background = _util.Util.makeCssRgb(
                rgbColor[0],
                rgbColor[1],
                rgbColor[2]
              );
            }

            if (!extendStart) {
              colorStops.unshift([0, background]);
              colorStops[1][0] += Shadings.SMALL_NUMBER;
            }

            if (!extendEnd) {
              colorStops[colorStops.length - 1][0] -= Shadings.SMALL_NUMBER;
              colorStops.push([1, background]);
            }

            this.colorStops = colorStops;
          }
