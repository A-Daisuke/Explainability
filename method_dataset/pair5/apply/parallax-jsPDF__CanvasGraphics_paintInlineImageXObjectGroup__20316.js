const __obj__ = {
            paintInlineImageXObjectGroup: function CanvasGraphics_paintInlineImageXObjectGroup(
              imgData,
              map
            ) {
              var ctx = this.ctx;
              var w = imgData.width;
              var h = imgData.height;
              var tmpCanvas = this.cachedCanvases.getCanvas(
                "inlineImage",
                w,
                h
              );
              var tmpCtx = tmpCanvas.context;
              putBinaryImageData(tmpCtx, imgData);

              for (var i = 0, ii = map.length; i < ii; i++) {
                var entry = map[i];
                ctx.save();
                ctx.transform.apply(ctx, entry.transform);
                ctx.scale(1, -1);
                ctx.drawImage(
                  tmpCanvas.canvas,
                  entry.x,
                  entry.y,
                  entry.w,
                  entry.h,
                  0,
                  -1,
                  1,
                  1
                );

                if (this.imageLayer) {
                  var position = this.getCanvasPosition(entry.x, entry.y);
                  this.imageLayer.appendImage({
                    imgData: imgData,
                    left: position[0],
                    top: position[1],
                    width: w,
                    height: h
                  });
                }

                ctx.restore();
              }
            },

};
