function __method_wrapper__() {
            showType3Text: function CanvasGraphics_showType3Text(glyphs) {
              var ctx = this.ctx;
              var current = this.current;
              var font = current.font;
              var fontSize = current.fontSize;
              var fontDirection = current.fontDirection;
              var spacingDir = font.vertical ? 1 : -1;
              var charSpacing = current.charSpacing;
              var wordSpacing = current.wordSpacing;
              var textHScale = current.textHScale * fontDirection;
              var fontMatrix = current.fontMatrix || _util.FONT_IDENTITY_MATRIX;
              var glyphsLength = glyphs.length;
              var isTextInvisible =
                current.textRenderingMode === _util.TextRenderingMode.INVISIBLE;
              var i, glyph, width, spacingLength;

              if (isTextInvisible || fontSize === 0) {
                return;
              }

              this._cachedGetSinglePixelWidth = null;
              ctx.save();
              ctx.transform.apply(ctx, current.textMatrix);
              ctx.translate(current.x, current.y);
              ctx.scale(textHScale, fontDirection);

              for (i = 0; i < glyphsLength; ++i) {
                glyph = glyphs[i];

                if ((0, _util.isNum)(glyph)) {
                  spacingLength = (spacingDir * glyph * fontSize) / 1000;
                  this.ctx.translate(spacingLength, 0);
                  current.x += spacingLength * textHScale;
                  continue;
                }

                var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
                var operatorList =
                  font.charProcOperatorList[glyph.operatorListId];

                if (!operatorList) {
                  (0, _util.warn)(
                    'Type3 character "'.concat(
                      glyph.operatorListId,
                      '" is not available.'
                    )
                  );
                  continue;
                }

                this.processingType3 = glyph;
                this.save();
                ctx.scale(fontSize, fontSize);
                ctx.transform.apply(ctx, fontMatrix);
                this.executeOperatorList(operatorList);
                this.restore();

                var transformed = _util.Util.applyTransform(
                  [glyph.width, 0],
                  fontMatrix
                );

                width = transformed[0] * fontSize + spacing;
                ctx.translate(width, 0);
                current.x += width * textHScale;
              }

              ctx.restore();
              this.processingType3 = null;
            },

}
