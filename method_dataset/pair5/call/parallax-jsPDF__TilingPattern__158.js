function TilingPattern(boundingBox, xStep, yStep, gState, matrix) {
  if (!(this instanceof TilingPattern)) {
    return new TilingPattern(boundingBox, xStep, yStep, gState, matrix);
  }

  this.boundingBox = boundingBox;
  this.xStep = xStep;
  this.yStep = yStep;

  this.stream = ""; // set by endTilingPattern();

  this.cloneIndex = 0;

  Pattern.call(this, gState, matrix);
}
