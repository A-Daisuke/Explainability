const __obj__ = {
            fill: function CanvasGraphics_fill(consumePath) {
              consumePath =
                typeof consumePath !== "undefined" ? consumePath : true;
              var ctx = this.ctx;
              var fillColor = this.current.fillColor;
              var isPatternFill = this.current.patternFill;
              var needRestore = false;

              if (isPatternFill) {
                ctx.save();

                if (this.baseTransform) {
                  ctx.setTransform.apply(ctx, this.baseTransform);
                }

                ctx.fillStyle = fillColor.getPattern(ctx, this);
                needRestore = true;
              }

              if (this.pendingEOFill) {
                ctx.fill("evenodd");
                this.pendingEOFill = false;
              } else {
                ctx.fill();
              }

              if (needRestore) {
                ctx.restore();
              }

              if (consumePath) {
                this.consumePath();
              }
            },

};
