const __obj__ = {
            paintChar: function paintChar(character, x, y, patternTransform) {
              var ctx = this.ctx;
              var current = this.current;
              var font = current.font;
              var textRenderingMode = current.textRenderingMode;
              var fontSize = current.fontSize / current.fontSizeScale;
              var fillStrokeMode =
                textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
              var isAddToPathSet = !!(
                textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG
              );
              var patternFill = current.patternFill && font.data;
              var addToPath;

              if (font.disableFontFace || isAddToPathSet || patternFill) {
                addToPath = font.getPathGenerator(this.commonObjs, character);
              }

              if (font.disableFontFace || patternFill) {
                ctx.save();
                ctx.translate(x, y);
                ctx.beginPath();
                addToPath(ctx, fontSize);

                if (patternTransform) {
                  ctx.setTransform.apply(ctx, patternTransform);
                }

                if (
                  fillStrokeMode === _util.TextRenderingMode.FILL ||
                  fillStrokeMode === _util.TextRenderingMode.FILL_STROKE
                ) {
                  ctx.fill();
                }

                if (
                  fillStrokeMode === _util.TextRenderingMode.STROKE ||
                  fillStrokeMode === _util.TextRenderingMode.FILL_STROKE
                ) {
                  ctx.stroke();
                }

                ctx.restore();
              } else {
                if (
                  fillStrokeMode === _util.TextRenderingMode.FILL ||
                  fillStrokeMode === _util.TextRenderingMode.FILL_STROKE
                ) {
                  ctx.fillText(character, x, y);
                }

                if (
                  fillStrokeMode === _util.TextRenderingMode.STROKE ||
                  fillStrokeMode === _util.TextRenderingMode.FILL_STROKE
                ) {
                  ctx.strokeText(character, x, y);
                }
              }

              if (isAddToPathSet) {
                var paths =
                  this.pendingTextPaths || (this.pendingTextPaths = []);
                paths.push({
                  transform: ctx.mozCurrentTransform,
                  x: x,
                  y: y,
                  fontSize: fontSize,
                  addToPath: addToPath
                });
              }
            },

};
