const __obj__ = {
            beginDrawing: function beginDrawing(_ref) {
              var transform = _ref.transform,
                viewport = _ref.viewport,
                _ref$transparency = _ref.transparency,
                transparency =
                  _ref$transparency === void 0 ? false : _ref$transparency,
                _ref$background = _ref.background,
                background =
                  _ref$background === void 0 ? null : _ref$background;
              var width = this.ctx.canvas.width;
              var height = this.ctx.canvas.height;
              this.ctx.save();
              this.ctx.fillStyle = background || "rgb(255, 255, 255)";
              this.ctx.fillRect(0, 0, width, height);
              this.ctx.restore();

              if (transparency) {
                var transparentCanvas = this.cachedCanvases.getCanvas(
                  "transparent",
                  width,
                  height,
                  true
                );
                this.compositeCtx = this.ctx;
                this.transparentCanvas = transparentCanvas.canvas;
                this.ctx = transparentCanvas.context;
                this.ctx.save();
                this.ctx.transform.apply(
                  this.ctx,
                  this.compositeCtx.mozCurrentTransform
                );
              }

              this.ctx.save();
              resetCtxToDefault(this.ctx);

              if (transform) {
                this.ctx.transform.apply(this.ctx, transform);
              }

              this.ctx.transform.apply(this.ctx, viewport.transform);
              this.baseTransform = this.ctx.mozCurrentTransform.slice();

              if (this.imageLayer) {
                this.imageLayer.beginLayout();
              }
            },

};
