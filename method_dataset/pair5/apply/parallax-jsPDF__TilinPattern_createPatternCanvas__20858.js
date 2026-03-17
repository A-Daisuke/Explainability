const __obj__ = {
            createPatternCanvas: function TilinPattern_createPatternCanvas(
              owner
            ) {
              var operatorList = this.operatorList;
              var bbox = this.bbox;
              var xstep = this.xstep;
              var ystep = this.ystep;
              var paintType = this.paintType;
              var tilingType = this.tilingType;
              var color = this.color;
              var canvasGraphicsFactory = this.canvasGraphicsFactory;
              (0, _util.info)("TilingType: " + tilingType);
              var x0 = bbox[0],
                y0 = bbox[1],
                x1 = bbox[2],
                y1 = bbox[3];
              var topLeft = [x0, y0];
              var botRight = [x0 + xstep, y0 + ystep];
              var width = botRight[0] - topLeft[0];
              var height = botRight[1] - topLeft[1];

              var matrixScale = _util.Util.singularValueDecompose2dScale(
                this.matrix
              );

              var curMatrixScale = _util.Util.singularValueDecompose2dScale(
                this.baseTransform
              );

              var combinedScale = [
                matrixScale[0] * curMatrixScale[0],
                matrixScale[1] * curMatrixScale[1]
              ];
              width = Math.min(
                Math.ceil(Math.abs(width * combinedScale[0])),
                MAX_PATTERN_SIZE
              );
              height = Math.min(
                Math.ceil(Math.abs(height * combinedScale[1])),
                MAX_PATTERN_SIZE
              );
              var tmpCanvas = owner.cachedCanvases.getCanvas(
                "pattern",
                width,
                height,
                true
              );
              var tmpCtx = tmpCanvas.context;
              var graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
              graphics.groupLevel = owner.groupLevel;
              this.setFillAndStrokeStyleToContext(graphics, paintType, color);
              this.setScale(width, height, xstep, ystep);
              this.transformToScale(graphics);
              var tmpTranslate = [1, 0, 0, 1, -topLeft[0], -topLeft[1]];
              graphics.transform.apply(graphics, tmpTranslate);
              this.clipBbox(graphics, bbox, x0, y0, x1, y1);
              graphics.executeOperatorList(operatorList);
              return tmpCanvas.canvas;
            },

};
