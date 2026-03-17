const __obj__ = {
            endText: function CanvasGraphics_endText() {
              var paths = this.pendingTextPaths;
              var ctx = this.ctx;

              if (paths === undefined) {
                ctx.beginPath();
                return;
              }

              ctx.save();
              ctx.beginPath();

              for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                ctx.setTransform.apply(ctx, path.transform);
                ctx.translate(path.x, path.y);
                path.addToPath(ctx, path.fontSize);
              }

              ctx.restore();
              ctx.clip();
              ctx.beginPath();
              delete this.pendingTextPaths;
            },

};
