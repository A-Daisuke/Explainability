function __method_wrapper__() {
            bounds.forEach(function(boundary) {
              var i = 0;

              while (i < horizon.length && horizon[i].end <= boundary.y1) {
                i++;
              }

              var j = horizon.length - 1;

              while (j >= 0 && horizon[j].start >= boundary.y2) {
                j--;
              }

              var horizonPart, affectedBoundary;
              var q,
                k,
                maxXNew = -Infinity;

              for (q = i; q <= j; q++) {
                horizonPart = horizon[q];
                affectedBoundary = horizonPart.boundary;
                var xNew;

                if (affectedBoundary.x2 > boundary.x1) {
                  xNew =
                    affectedBoundary.index > boundary.index
                      ? affectedBoundary.x1New
                      : boundary.x1;
                } else if (affectedBoundary.x2New === undefined) {
                  xNew = (affectedBoundary.x2 + boundary.x1) / 2;
                } else {
                  xNew = affectedBoundary.x2New;
                }

                if (xNew > maxXNew) {
                  maxXNew = xNew;
                }
              }

              boundary.x1New = maxXNew;

              for (q = i; q <= j; q++) {
                horizonPart = horizon[q];
                affectedBoundary = horizonPart.boundary;

                if (affectedBoundary.x2New === undefined) {
                  if (affectedBoundary.x2 > boundary.x1) {
                    if (affectedBoundary.index > boundary.index) {
                      affectedBoundary.x2New = affectedBoundary.x2;
                    }
                  } else {
                    affectedBoundary.x2New = maxXNew;
                  }
                } else if (affectedBoundary.x2New > maxXNew) {
                  affectedBoundary.x2New = Math.max(
                    maxXNew,
                    affectedBoundary.x2
                  );
                }
              }

              var changedHorizon = [],
                lastBoundary = null;

              for (q = i; q <= j; q++) {
                horizonPart = horizon[q];
                affectedBoundary = horizonPart.boundary;
                var useBoundary =
                  affectedBoundary.x2 > boundary.x2
                    ? affectedBoundary
                    : boundary;

                if (lastBoundary === useBoundary) {
                  changedHorizon[changedHorizon.length - 1].end =
                    horizonPart.end;
                } else {
                  changedHorizon.push({
                    start: horizonPart.start,
                    end: horizonPart.end,
                    boundary: useBoundary
                  });
                  lastBoundary = useBoundary;
                }
              }

              if (horizon[i].start < boundary.y1) {
                changedHorizon[0].start = boundary.y1;
                changedHorizon.unshift({
                  start: horizon[i].start,
                  end: boundary.y1,
                  boundary: horizon[i].boundary
                });
              }

              if (boundary.y2 < horizon[j].end) {
                changedHorizon[changedHorizon.length - 1].end = boundary.y2;
                changedHorizon.push({
                  start: boundary.y2,
                  end: horizon[j].end,
                  boundary: horizon[j].boundary
                });
              }

              for (q = i; q <= j; q++) {
                horizonPart = horizon[q];
                affectedBoundary = horizonPart.boundary;

                if (affectedBoundary.x2New !== undefined) {
                  continue;
                }

                var used = false;

                for (
                  k = i - 1;
                  !used && k >= 0 && horizon[k].start >= affectedBoundary.y1;
                  k--
                ) {
                  used = horizon[k].boundary === affectedBoundary;
                }

                for (
                  k = j + 1;
                  !used &&
                  k < horizon.length &&
                  horizon[k].end <= affectedBoundary.y2;
                  k++
                ) {
                  used = horizon[k].boundary === affectedBoundary;
                }

                for (k = 0; !used && k < changedHorizon.length; k++) {
                  used = changedHorizon[k].boundary === affectedBoundary;
                }

                if (!used) {
                  affectedBoundary.x2New = maxXNew;
                }
              }

              Array.prototype.splice.apply(
                horizon,
                [i, j - i + 1].concat(changedHorizon)
              );
            });

}
