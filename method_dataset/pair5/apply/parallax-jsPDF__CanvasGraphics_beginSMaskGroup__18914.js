const __obj__ = {
            beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {
              var activeSMask = this.current.activeSMask;
              var drawnWidth = activeSMask.canvas.width;
              var drawnHeight = activeSMask.canvas.height;
              var cacheId = "smaskGroupAt" + this.groupLevel;
              var scratchCanvas = this.cachedCanvases.getCanvas(
                cacheId,
                drawnWidth,
                drawnHeight,
                true
              );
              var currentCtx = this.ctx;
              var currentTransform = currentCtx.mozCurrentTransform;
              this.ctx.save();
              var groupCtx = scratchCanvas.context;
              groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
              groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
              groupCtx.transform.apply(groupCtx, currentTransform);
              activeSMask.startTransformInverse =
                groupCtx.mozCurrentTransformInverse;
              copyCtxState(currentCtx, groupCtx);
              this.ctx = groupCtx;
              this.setGState([
                ["BM", "source-over"],
                ["ca", 1],
                ["CA", 1]
              ]);
              this.groupStack.push(currentCtx);
              this.groupLevel++;
            },

};
