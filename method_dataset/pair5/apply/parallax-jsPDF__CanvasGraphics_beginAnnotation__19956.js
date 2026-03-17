function __method_wrapper__() {
            beginAnnotation: function CanvasGraphics_beginAnnotation(
              rect,
              transform,
              matrix
            ) {
              this.save();
              resetCtxToDefault(this.ctx);
              this.current = new CanvasExtraState();

              if (Array.isArray(rect) && rect.length === 4) {
                var width = rect[2] - rect[0];
                var height = rect[3] - rect[1];
                this.ctx.rect(rect[0], rect[1], width, height);
                this.clip();
                this.endPath();
              }

              this.transform.apply(this, transform);
              this.transform.apply(this, matrix);
            },

}
