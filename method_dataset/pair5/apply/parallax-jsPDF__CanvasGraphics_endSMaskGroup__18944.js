function __method_wrapper__() {
            suspendSMaskGroup: function CanvasGraphics_endSMaskGroup() {
              var groupCtx = this.ctx;
              this.groupLevel--;
              this.ctx = this.groupStack.pop();
              composeSMask(
                this.ctx,
                this.current.activeSMask,
                groupCtx,
                this.webGLContext
              );
              this.ctx.restore();
              this.ctx.save();
              copyCtxState(groupCtx, this.ctx);
              this.current.resumeSMaskCtx = groupCtx;

              var deltaTransform = _util.Util.transform(
                this.current.activeSMask.startTransformInverse,
                groupCtx.mozCurrentTransform
              );

              this.ctx.transform.apply(this.ctx, deltaTransform);
              groupCtx.save();
              groupCtx.setTransform(1, 0, 0, 1, 0, 0);
              groupCtx.clearRect(
                0,
                0,
                groupCtx.canvas.width,
                groupCtx.canvas.height
              );
              groupCtx.restore();
            },

}
