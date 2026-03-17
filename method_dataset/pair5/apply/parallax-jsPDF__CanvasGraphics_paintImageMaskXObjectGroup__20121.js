function __method_wrapper__() {
            paintImageMaskXObjectGroup: function CanvasGraphics_paintImageMaskXObjectGroup(
              images
            ) {
              var ctx = this.ctx;
              var fillColor = this.current.fillColor;
              var isPatternFill = this.current.patternFill;

              for (var i = 0, ii = images.length; i < ii; i++) {
                var image = images[i];
                var width = image.width,
                  height = image.height;
                var maskCanvas = this.cachedCanvases.getCanvas(
                  "maskCanvas",
                  width,
                  height
                );
                var maskCtx = maskCanvas.context;
                maskCtx.save();
                putBinaryImageMask(maskCtx, image);
                maskCtx.globalCompositeOperation = "source-in";
                maskCtx.fillStyle = isPatternFill
                  ? fillColor.getPattern(maskCtx, this)
                  : fillColor;
                maskCtx.fillRect(0, 0, width, height);
                maskCtx.restore();
                ctx.save();
                ctx.transform.apply(ctx, image.transform);
                ctx.scale(1, -1);
                ctx.drawImage(
                  maskCanvas.canvas,
                  0,
                  0,
                  width,
                  height,
                  0,
                  -1,
                  1,
                  1
                );
                ctx.restore();
              }
            },

}
