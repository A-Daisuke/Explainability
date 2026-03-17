  var getPagesByPath = function(path, pageWrapX, pageWrapY) {
    var result = [];
    pageWrapX = pageWrapX || this.pdf.internal.pageSize.width;
    pageWrapY =
      pageWrapY ||
      this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
    var yOffset = this.posY + this.ctx.prevPageLastElemOffset;

    switch (path.type) {
      default:
      case "mt":
      case "lt":
        result.push(Math.floor((path.y + yOffset) / pageWrapY) + 1);
        break;
      case "arc":
        result.push(
          Math.floor((path.y + yOffset - path.radius) / pageWrapY) + 1
        );
        result.push(
          Math.floor((path.y + yOffset + path.radius) / pageWrapY) + 1
        );
        break;
      case "qct":
        var rectOfQuadraticCurve = getQuadraticCurveBoundary(
          this.ctx.lastPoint.x,
          this.ctx.lastPoint.y,
          path.x1,
          path.y1,
          path.x,
          path.y
        );
        result.push(
          Math.floor((rectOfQuadraticCurve.y + yOffset) / pageWrapY) + 1
        );
        result.push(
          Math.floor(
            (rectOfQuadraticCurve.y + rectOfQuadraticCurve.h + yOffset) /
              pageWrapY
          ) + 1
        );
        break;
      case "bct":
        var rectOfBezierCurve = getBezierCurveBoundary(
          this.ctx.lastPoint.x,
          this.ctx.lastPoint.y,
          path.x1,
          path.y1,
          path.x2,
          path.y2,
          path.x,
          path.y
        );
        result.push(
          Math.floor((rectOfBezierCurve.y + yOffset) / pageWrapY) + 1
        );
        result.push(
          Math.floor(
            (rectOfBezierCurve.y + rectOfBezierCurve.h + yOffset) / pageWrapY
          ) + 1
        );
        break;
      case "rect":
        result.push(Math.floor((path.y + yOffset) / pageWrapY) + 1);
        result.push(Math.floor((path.y + path.h + yOffset) / pageWrapY) + 1);
    }

    for (var i = 0; i < result.length; i += 1) {
      while (this.pdf.internal.getNumberOfPages() < result[i]) {
        addPage.call(this);
      }
    }
    return result;
  };
