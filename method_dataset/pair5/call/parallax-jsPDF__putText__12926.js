    var putText = function putText(options) {
      var textAlign;
      switch (options.align) {
        case "right":
        case "end":
          textAlign = "right";
          break;
        case "center":
          textAlign = "center";
          break;
        case "left":
        case "start":
        default:
          textAlign = "left";
          break;
      }
      var textDimensions = this.pdf.getTextDimensions(options.text);
      var yBaseLine = getBaseline.call(this, options.y);
      var yBottom = getTextBottom.call(this, yBaseLine);
      var yTop = yBottom - textDimensions.h;
      var pt = this.ctx.transform.applyToPoint(new Point(options.x, yBaseLine));
      var decomposedTransformationMatrix = this.ctx.transform.decompose();
      var matrix = new Matrix();
      matrix = matrix.multiply(decomposedTransformationMatrix.translate);
      matrix = matrix.multiply(decomposedTransformationMatrix.skew);
      matrix = matrix.multiply(decomposedTransformationMatrix.scale);
      var baselineRect = this.ctx.transform.applyToRectangle(new Rectangle(options.x, yBaseLine, textDimensions.w, textDimensions.h));
      var textBounds = matrix.applyToRectangle(new Rectangle(options.x, yTop, textDimensions.w, textDimensions.h));
      var pageArray = getPagesByPath.call(this, textBounds);
      var pages = [];
      for (var ii = 0; ii < pageArray.length; ii += 1) {
        if (pages.indexOf(pageArray[ii]) === -1) {
          pages.push(pageArray[ii]);
        }
      }
      sortPages(pages);
      var clipPath, oldSize, oldLineWidth;
      if (this.autoPaging) {
        var min = pages[0];
        var max = pages[pages.length - 1];
        for (var i = min; i < max + 1; i++) {
          this.pdf.setPage(i);
          var topMargin = i === 1 ? this.posY + this.margin[0] : this.margin[0];
          var firstPageHeight = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2];
          var pageHeightMinusBottomMargin = this.pdf.internal.pageSize.height - this.margin[2];
          var pageHeightMinusMargins = pageHeightMinusBottomMargin - this.margin[0];
          var pageWidthMinusRightMargin = this.pdf.internal.pageSize.width - this.margin[1];
          var pageWidthMinusMargins = pageWidthMinusRightMargin - this.margin[3];
          var previousPageHeightSum = i === 1 ? 0 : firstPageHeight + (i - 2) * pageHeightMinusMargins;
          if (this.ctx.clip_path.length !== 0) {
            var tmpPaths = this.path;
            clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
            this.path = pathPositionRedo(clipPath, this.posX + this.margin[3], -1 * previousPageHeightSum + topMargin);
            drawPaths.call(this, "fill", true);
            this.path = tmpPaths;
          }
          var textBoundsOnPage = pathPositionRedo([JSON.parse(JSON.stringify(textBounds))], this.posX + this.margin[3], -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset)[0];
          if (options.scale >= 0.01) {
            oldSize = this.pdf.internal.getFontSize();
            this.pdf.setFontSize(oldSize * options.scale);
            oldLineWidth = this.lineWidth;
            this.lineWidth = oldLineWidth * options.scale;
          }
          var doSlice = this.autoPaging !== "text";
          if (doSlice || textBoundsOnPage.y + textBoundsOnPage.h <= pageHeightMinusBottomMargin) {
            if (doSlice || textBoundsOnPage.y >= topMargin && textBoundsOnPage.x <= pageWidthMinusRightMargin) {
              var croppedText = doSlice ? options.text : this.pdf.splitTextToSize(options.text, options.maxWidth || pageWidthMinusRightMargin - textBoundsOnPage.x)[0];
              var baseLineRectOnPage = pathPositionRedo([JSON.parse(JSON.stringify(baselineRect))], this.posX + this.margin[3], -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset)[0];
              var needsClipping = doSlice && (i > min || i < max) && hasMargins.call(this);
              if (needsClipping) {
                this.pdf.saveGraphicsState();
                this.pdf.rect(this.margin[3], this.margin[0], pageWidthMinusMargins, pageHeightMinusMargins, null).clip().discardPath();
              }
              this.pdf.text(croppedText, baseLineRectOnPage.x, baseLineRectOnPage.y, {
                angle: options.angle,
                align: textAlign,
                renderingMode: options.renderingMode
              });
              if (needsClipping) {
                this.pdf.restoreGraphicsState();
              }
            }
          } else {
            // This text is the last element of the page, but it got cut off due to the margin
            // so we render it in the next page

            if (textBoundsOnPage.y < pageHeightMinusBottomMargin) {
              // As a result, all other elements have their y offset increased
              this.ctx.prevPageLastElemOffset += pageHeightMinusBottomMargin - textBoundsOnPage.y;
            }
          }
          if (options.scale >= 0.01) {
            this.pdf.setFontSize(oldSize);
            this.lineWidth = oldLineWidth;
          }
        }
      } else {
        if (options.scale >= 0.01) {
          oldSize = this.pdf.internal.getFontSize();
          this.pdf.setFontSize(oldSize * options.scale);
          oldLineWidth = this.lineWidth;
          this.lineWidth = oldLineWidth * options.scale;
        }
        this.pdf.text(options.text, pt.x + this.posX, pt.y + this.posY, {
          angle: options.angle,
          align: textAlign,
          renderingMode: options.renderingMode,
          maxWidth: options.maxWidth
        });
        if (options.scale >= 0.01) {
          this.pdf.setFontSize(oldSize);
          this.lineWidth = oldLineWidth;
        }
      }
    };
