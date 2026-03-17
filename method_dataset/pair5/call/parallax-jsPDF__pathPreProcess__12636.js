    var pathPreProcess = function pathPreProcess(rule, isClip) {
      var fillStyle = this.fillStyle;
      var strokeStyle = this.strokeStyle;
      var lineCap = this.lineCap;
      var oldLineWidth = this.lineWidth;
      var lineWidth = Math.abs(oldLineWidth * this.ctx.transform.scaleX);
      var lineJoin = this.lineJoin;
      var origPath = JSON.parse(JSON.stringify(this.path));
      var xPath = JSON.parse(JSON.stringify(this.path));
      var clipPath;
      var tmpPath;
      var pages = [];
      for (var i = 0; i < xPath.length; i++) {
        if (typeof xPath[i].x !== "undefined") {
          var page = getPagesByPath.call(this, xPath[i]);
          for (var ii = 0; ii < page.length; ii += 1) {
            if (pages.indexOf(page[ii]) === -1) {
              pages.push(page[ii]);
            }
          }
        }
      }
      for (var j = 0; j < pages.length; j++) {
        while (this.pdf.internal.getNumberOfPages() < pages[j]) {
          addPage.call(this);
        }
      }
      sortPages(pages);
      if (this.autoPaging) {
        var min = pages[0];
        var max = pages[pages.length - 1];
        for (var k = min; k < max + 1; k++) {
          this.pdf.setPage(k);
          this.fillStyle = fillStyle;
          this.strokeStyle = strokeStyle;
          this.lineCap = lineCap;
          this.lineWidth = lineWidth;
          this.lineJoin = lineJoin;
          var pageWidthMinusMargins = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1];
          var topMargin = k === 1 ? this.posY + this.margin[0] : this.margin[0];
          var firstPageHeight = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2];
          var pageHeightMinusMargins = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
          var previousPageHeightSum = k === 1 ? 0 : firstPageHeight + (k - 2) * pageHeightMinusMargins;
          if (this.ctx.clip_path.length !== 0) {
            var tmpPaths = this.path;
            clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
            this.path = pathPositionRedo(clipPath, this.posX + this.margin[3], -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset);
            drawPaths.call(this, rule, true);
            this.path = tmpPaths;
          }
          tmpPath = JSON.parse(JSON.stringify(origPath));
          this.path = pathPositionRedo(tmpPath, this.posX + this.margin[3], -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset);
          if (isClip === false || k === 0) {
            var needsClipping = (k > min || k < max) && hasMargins.call(this);
            if (needsClipping) {
              this.pdf.saveGraphicsState();
              this.pdf.rect(this.margin[3], this.margin[0], pageWidthMinusMargins, pageHeightMinusMargins, null).clip().discardPath();
            }
            drawPaths.call(this, rule, isClip);
            if (needsClipping) {
              this.pdf.restoreGraphicsState();
            }
          }
          this.lineWidth = oldLineWidth;
        }
      } else {
        this.lineWidth = lineWidth;
        drawPaths.call(this, rule, isClip);
        this.lineWidth = oldLineWidth;
      }
      this.path = origPath;
    };
