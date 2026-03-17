const __obj__ = {
            showText: function CanvasGraphics_showText(glyphs) {
              var current = this.current;
              var font = current.font;

              if (font.isType3Font) {
                return this.showType3Text(glyphs);
              }

              var fontSize = current.fontSize;

              if (fontSize === 0) {
                return;
              }

              var ctx = this.ctx;
              var fontSizeScale = current.fontSizeScale;
              var charSpacing = current.charSpacing;
              var wordSpacing = current.wordSpacing;
              var fontDirection = current.fontDirection;
              var textHScale = current.textHScale * fontDirection;
              var glyphsLength = glyphs.length;
              var vertical = font.vertical;
              var spacingDir = vertical ? 1 : -1;
              var defaultVMetrics = font.defaultVMetrics;
              var widthAdvanceScale = fontSize * current.fontMatrix[0];
              var simpleFillText =
                current.textRenderingMode === _util.TextRenderingMode.FILL &&
                !font.disableFontFace &&
                !current.patternFill;
              ctx.save();
              var patternTransform;

              if (current.patternFill) {
                ctx.save();
                var pattern = current.fillColor.getPattern(ctx, this);
                patternTransform = ctx.mozCurrentTransform;
                ctx.restore();
                ctx.fillStyle = pattern;
              }

              ctx.transform.apply(ctx, current.textMatrix);
              ctx.translate(current.x, current.y + current.textRise);

              if (fontDirection > 0) {
                ctx.scale(textHScale, -1);
              } else {
                ctx.scale(textHScale, 1);
              }

              var lineWidth = current.lineWidth;
              var scale = current.textMatrixScale;

              if (scale === 0 || lineWidth === 0) {
                var fillStrokeMode =
                  current.textRenderingMode &
                  _util.TextRenderingMode.FILL_STROKE_MASK;

                if (
                  fillStrokeMode === _util.TextRenderingMode.STROKE ||
                  fillStrokeMode === _util.TextRenderingMode.FILL_STROKE
                ) {
                  this._cachedGetSinglePixelWidth = null;
                  lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
                }
              } else {
                lineWidth /= scale;
              }

              if (fontSizeScale !== 1.0) {
                ctx.scale(fontSizeScale, fontSizeScale);
                lineWidth /= fontSizeScale;
              }

              ctx.lineWidth = lineWidth;
              var x = 0,
                i;

              for (i = 0; i < glyphsLength; ++i) {
                var glyph = glyphs[i];

                if ((0, _util.isNum)(glyph)) {
                  x += (spacingDir * glyph * fontSize) / 1000;
                  continue;
                }

                var restoreNeeded = false;
                var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
                var character = glyph.fontChar;
                var accent = glyph.accent;
                var scaledX, scaledY, scaledAccentX, scaledAccentY;
                var width = glyph.width;

                if (vertical) {
                  var vmetric, vx, vy;
                  vmetric = glyph.vmetric || defaultVMetrics;
                  vx = glyph.vmetric ? vmetric[1] : width * 0.5;
                  vx = -vx * widthAdvanceScale;
                  vy = vmetric[2] * widthAdvanceScale;
                  width = vmetric ? -vmetric[0] : width;
                  scaledX = vx / fontSizeScale;
                  scaledY = (x + vy) / fontSizeScale;
                } else {
                  scaledX = x / fontSizeScale;
                  scaledY = 0;
                }

                if (font.remeasure && width > 0) {
                  var measuredWidth =
                    ((ctx.measureText(character).width * 1000) / fontSize) *
                    fontSizeScale;

                  if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
                    var characterScaleX = width / measuredWidth;
                    restoreNeeded = true;
                    ctx.save();
                    ctx.scale(characterScaleX, 1);
                    scaledX /= characterScaleX;
                  } else if (width !== measuredWidth) {
                    scaledX +=
                      (((width - measuredWidth) / 2000) * fontSize) /
                      fontSizeScale;
                  }
                }

                if (glyph.isInFont || font.missingFile) {
                  if (simpleFillText && !accent) {
                    ctx.fillText(character, scaledX, scaledY);
                  } else {
                    this.paintChar(
                      character,
                      scaledX,
                      scaledY,
                      patternTransform
                    );

                    if (accent) {
                      scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
                      scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
                      this.paintChar(
                        accent.fontChar,
                        scaledAccentX,
                        scaledAccentY,
                        patternTransform
                      );
                    }
                  }
                }

                var charWidth =
                  width * widthAdvanceScale + spacing * fontDirection;
                x += charWidth;

                if (restoreNeeded) {
                  ctx.restore();
                }
              }

              if (vertical) {
                current.y -= x * textHScale;
              } else {
                current.x += x * textHScale;
              }

              ctx.restore();
            },

};
