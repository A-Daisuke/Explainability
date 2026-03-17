function __method_wrapper__() {
  Context2D.prototype.drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height) {
    var imageProperties = this.pdf.getImageProperties(img);
    var factorX = 1;
    var factorY = 1;
    var clipFactorX = 1;
    var clipFactorY = 1;
    if (typeof swidth !== "undefined" && typeof width !== "undefined") {
      clipFactorX = width / swidth;
      clipFactorY = height / sheight;
      factorX = imageProperties.width / swidth * width / swidth;
      factorY = imageProperties.height / sheight * height / sheight;
    }

    //is sx and sy are set and x and y not, set x and y with values of sx and sy
    if (typeof x === "undefined") {
      x = sx;
      y = sy;
      sx = 0;
      sy = 0;
    }
    if (typeof swidth !== "undefined" && typeof width === "undefined") {
      width = swidth;
      height = sheight;
    }
    if (typeof swidth === "undefined" && typeof width === "undefined") {
      width = imageProperties.width;
      height = imageProperties.height;
    }
    var decomposedTransformationMatrix = this.ctx.transform.decompose();
    var angle = rad2deg(decomposedTransformationMatrix.rotate.shx);
    var matrix = new Matrix();
    matrix = matrix.multiply(decomposedTransformationMatrix.translate);
    matrix = matrix.multiply(decomposedTransformationMatrix.skew);
    matrix = matrix.multiply(decomposedTransformationMatrix.scale);
    var xRect = matrix.applyToRectangle(new Rectangle(x - sx * clipFactorX, y - sy * clipFactorY, swidth * factorX, sheight * factorY));
    var pageArray = getPagesByPath.call(this, xRect);
    var pages = [];
    for (var ii = 0; ii < pageArray.length; ii += 1) {
      if (pages.indexOf(pageArray[ii]) === -1) {
        pages.push(pageArray[ii]);
      }
    }
    sortPages(pages);
    var clipPath;
    if (this.autoPaging) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var i = min; i < max + 1; i++) {
        this.pdf.setPage(i);
        var pageWidthMinusMargins = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1];
        var topMargin = i === 1 ? this.posY + this.margin[0] : this.margin[0];
        var firstPageHeight = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2];
        var pageHeightMinusMargins = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
        var previousPageHeightSum = i === 1 ? 0 : firstPageHeight + (i - 2) * pageHeightMinusMargins;
        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(clipPath, this.posX + this.margin[3], -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset);
          drawPaths.call(this, "fill", true);
          this.path = tmpPaths;
        }
        var tmpRect = JSON.parse(JSON.stringify(xRect));
        tmpRect = pathPositionRedo([tmpRect], this.posX + this.margin[3], -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset)[0];
        var needsClipping = (i > min || i < max) && hasMargins.call(this);
        if (needsClipping) {
          this.pdf.saveGraphicsState();
          this.pdf.rect(this.margin[3], this.margin[0], pageWidthMinusMargins, pageHeightMinusMargins, null).clip().discardPath();
        }
        this.pdf.addImage(img, "JPEG", tmpRect.x, tmpRect.y, tmpRect.w, tmpRect.h, null, null, angle);
        if (needsClipping) {
          this.pdf.restoreGraphicsState();
        }
      }
    } else {
      this.pdf.addImage(img, "JPEG", xRect.x, xRect.y, xRect.w, xRect.h, null, null, angle);
    }
  };

}
