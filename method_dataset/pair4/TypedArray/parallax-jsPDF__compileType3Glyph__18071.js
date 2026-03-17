        function compileType3Glyph(imgData) {
          var POINT_TO_PROCESS_LIMIT = 1000;
          var width = imgData.width,
            height = imgData.height;
          var i,
            j,
            j0,
            width1 = width + 1;
          var points = new Uint8Array(width1 * (height + 1));
          var POINT_TYPES = new Uint8Array([
            0,
            2,
            4,
            0,
            1,
            0,
            5,
            4,
            8,
            10,
            0,
            8,
            0,
            2,
            1,
            0
          ]);
          var lineSize = (width + 7) & ~7,
            data0 = imgData.data;
          var data = new Uint8Array(lineSize * height),
            pos = 0,
            ii;

          for (i = 0, ii = data0.length; i < ii; i++) {
            var mask = 128,
              elem = data0[i];

            while (mask > 0) {
              data[pos++] = elem & mask ? 0 : 255;
              mask >>= 1;
            }
          }

          var count = 0;
          pos = 0;

          if (data[pos] !== 0) {
            points[0] = 1;
            ++count;
          }

          for (j = 1; j < width; j++) {
            if (data[pos] !== data[pos + 1]) {
              points[j] = data[pos] ? 2 : 1;
              ++count;
            }

            pos++;
          }

          if (data[pos] !== 0) {
            points[j] = 2;
            ++count;
          }

          for (i = 1; i < height; i++) {
            pos = i * lineSize;
            j0 = i * width1;

            if (data[pos - lineSize] !== data[pos]) {
              points[j0] = data[pos] ? 1 : 8;
              ++count;
            }

            var sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);

            for (j = 1; j < width; j++) {
              sum =
                (sum >> 2) +
                (data[pos + 1] ? 4 : 0) +
                (data[pos - lineSize + 1] ? 8 : 0);

              if (POINT_TYPES[sum]) {
                points[j0 + j] = POINT_TYPES[sum];
                ++count;
              }

              pos++;
            }

            if (data[pos - lineSize] !== data[pos]) {
              points[j0 + j] = data[pos] ? 2 : 4;
              ++count;
            }

            if (count > POINT_TO_PROCESS_LIMIT) {
              return null;
            }
          }

          pos = lineSize * (height - 1);
          j0 = i * width1;

          if (data[pos] !== 0) {
            points[j0] = 8;
            ++count;
          }

          for (j = 1; j < width; j++) {
            if (data[pos] !== data[pos + 1]) {
              points[j0 + j] = data[pos] ? 4 : 8;
              ++count;
            }

            pos++;
          }

          if (data[pos] !== 0) {
            points[j0 + j] = 4;
            ++count;
          }

          if (count > POINT_TO_PROCESS_LIMIT) {
            return null;
          }

          var steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
          var outlines = [];

          for (i = 0; count && i <= height; i++) {
            var p = i * width1;
            var end = p + width;

            while (p < end && !points[p]) {
              p++;
            }

            if (p === end) {
              continue;
            }

            var coords = [p % width1, i];
            var type = points[p],
              p0 = p,
              pp;

            do {
              var step = steps[type];

              do {
                p += step;
              } while (!points[p]);

              pp = points[p];

              if (pp !== 5 && pp !== 10) {
                type = pp;
                points[p] = 0;
              } else {
                type = pp & ((0x33 * type) >> 4);
                points[p] &= (type >> 2) | (type << 2);
              }

              coords.push(p % width1);
              coords.push((p / width1) | 0);

              if (!points[p]) {
                --count;
              }
            } while (p0 !== p);

            outlines.push(coords);
            --i;
          }

          var drawOutline = function drawOutline(c) {
            c.save();
            c.scale(1 / width, -1 / height);
            c.translate(0, -height);
            c.beginPath();

            for (var i = 0, ii = outlines.length; i < ii; i++) {
              var o = outlines[i];
              c.moveTo(o[0], o[1]);

              for (var j = 2, jj = o.length; j < jj; j += 2) {
                c.lineTo(o[j], o[j + 1]);
              }
            }

            c.fill();
            c.beginPath();
            c.restore();
          };

          return drawOutline;
        }
