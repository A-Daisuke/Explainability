const __obj__ = {
              getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
                var scale;

                if (shadingFill) {
                  scale = _util.Util.singularValueDecompose2dScale(
                    ctx.mozCurrentTransform
                  );
                } else {
                  scale = _util.Util.singularValueDecompose2dScale(
                    owner.baseTransform
                  );

                  if (matrix) {
                    var matrixScale = _util.Util.singularValueDecompose2dScale(
                      matrix
                    );

                    scale = [
                      scale[0] * matrixScale[0],
                      scale[1] * matrixScale[1]
                    ];
                  }
                }

                var temporaryPatternCanvas = createMeshCanvas(
                  bounds,
                  scale,
                  coords,
                  colors,
                  figures,
                  shadingFill ? null : background,
                  owner.cachedCanvases,
                  owner.webGLContext
                );

                if (!shadingFill) {
                  ctx.setTransform.apply(ctx, owner.baseTransform);

                  if (matrix) {
                    ctx.transform.apply(ctx, matrix);
                  }
                }

                ctx.translate(
                  temporaryPatternCanvas.offsetX,
                  temporaryPatternCanvas.offsetY
                );
                ctx.scale(
                  temporaryPatternCanvas.scaleX,
                  temporaryPatternCanvas.scaleY
                );
                return ctx.createPattern(
                  temporaryPatternCanvas.canvas,
                  "no-repeat"
                );
              }

};
