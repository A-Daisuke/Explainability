const __obj__ = {
            beginGroup: function CanvasGraphics_beginGroup(group) {
              this.save();
              var currentCtx = this.ctx;

              if (!group.isolated) {
                (0, _util.info)("TODO: Support non-isolated groups.");
              }

              if (group.knockout) {
                (0, _util.warn)("Knockout groups not supported.");
              }

              var currentTransform = currentCtx.mozCurrentTransform;

              if (group.matrix) {
                currentCtx.transform.apply(currentCtx, group.matrix);
              }

              if (!group.bbox) {
                throw new Error("Bounding box is required.");
              }

              var bounds = _util.Util.getAxialAlignedBoundingBox(
                group.bbox,
                currentCtx.mozCurrentTransform
              );

              var canvasBounds = [
                0,
                0,
                currentCtx.canvas.width,
                currentCtx.canvas.height
              ];
              bounds = _util.Util.intersect(bounds, canvasBounds) || [
                0,
                0,
                0,
                0
              ];
              var offsetX = Math.floor(bounds[0]);
              var offsetY = Math.floor(bounds[1]);
              var drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
              var drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
              var scaleX = 1,
                scaleY = 1;

              if (drawnWidth > MAX_GROUP_SIZE) {
                scaleX = drawnWidth / MAX_GROUP_SIZE;
                drawnWidth = MAX_GROUP_SIZE;
              }

              if (drawnHeight > MAX_GROUP_SIZE) {
                scaleY = drawnHeight / MAX_GROUP_SIZE;
                drawnHeight = MAX_GROUP_SIZE;
              }

              var cacheId = "groupAt" + this.groupLevel;

              if (group.smask) {
                cacheId += "_smask_" + (this.smaskCounter++ % 2);
              }

              var scratchCanvas = this.cachedCanvases.getCanvas(
                cacheId,
                drawnWidth,
                drawnHeight,
                true
              );
              var groupCtx = scratchCanvas.context;
              groupCtx.scale(1 / scaleX, 1 / scaleY);
              groupCtx.translate(-offsetX, -offsetY);
              groupCtx.transform.apply(groupCtx, currentTransform);

              if (group.smask) {
                this.smaskStack.push({
                  canvas: scratchCanvas.canvas,
                  context: groupCtx,
                  offsetX: offsetX,
                  offsetY: offsetY,
                  scaleX: scaleX,
                  scaleY: scaleY,
                  subtype: group.smask.subtype,
                  backdrop: group.smask.backdrop,
                  transferMap: group.smask.transferMap || null,
                  startTransformInverse: null
                });
              } else {
                currentCtx.setTransform(1, 0, 0, 1, 0, 0);
                currentCtx.translate(offsetX, offsetY);
                currentCtx.scale(scaleX, scaleY);
              }

              copyCtxState(currentCtx, groupCtx);
              this.ctx = groupCtx;
              this.setGState([
                ["BM", "source-over"],
                ["ca", 1],
                ["CA", 1]
              ]);
              this.groupStack.push(currentCtx);
              this.groupLevel++;
              this.current.activeSMask = null;
            },

};
