const __obj__ = {
            stroke: function CanvasGraphics_stroke(consumePath) {
              consumePath =
                typeof consumePath !== "undefined" ? consumePath : true;
              var ctx = this.ctx;
              var strokeColor = this.current.strokeColor;
              ctx.lineWidth = Math.max(
                this.getSinglePixelWidth() * MIN_WIDTH_FACTOR,
                this.current.lineWidth
              );
              ctx.globalAlpha = this.current.strokeAlpha;

              if (
                strokeColor &&
                strokeColor.hasOwnProperty("type") &&
                strokeColor.type === "Pattern"
              ) {
                ctx.save();
                ctx.strokeStyle = strokeColor.getPattern(ctx, this);
                ctx.stroke();
                ctx.restore();
              } else {
                ctx.stroke();
              }

              if (consumePath) {
                this.consumePath();
              }

              ctx.globalAlpha = this.current.fillAlpha;
            },

};
