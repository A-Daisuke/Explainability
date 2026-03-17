function __method_wrapper__() {
            paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(
              matrix,
              bbox
            ) {
              this.save();
              this.baseTransformStack.push(this.baseTransform);

              if (Array.isArray(matrix) && matrix.length === 6) {
                this.transform.apply(this, matrix);
              }

              this.baseTransform = this.ctx.mozCurrentTransform;

              if (bbox) {
                var width = bbox[2] - bbox[0];
                var height = bbox[3] - bbox[1];
                this.ctx.rect(bbox[0], bbox[1], width, height);
                this.clip();
                this.endPath();
              }
            },

}
