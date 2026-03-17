function __method_wrapper__() {
            endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
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
              copyCtxState(groupCtx, this.ctx);

              var deltaTransform = _util.Util.transform(
                this.current.activeSMask.startTransformInverse,
                groupCtx.mozCurrentTransform
              );

              this.ctx.transform.apply(this.ctx, deltaTransform);
            },

}
