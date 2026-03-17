function __method_wrapper__() {
BpmnSpaceTool.prototype.calculateAdjustments = function(elements, axis, delta, start) {

  var canvasRoot = this._canvas.getRootElement(),
      spaceRoot = elements[0] === canvasRoot ? null : elements[0],
      enclosedArtifacts = [];

  // ensure
  if (spaceRoot) {
    enclosedArtifacts = values(
      getEnclosedElements(
        canvasRoot.children.filter(
          (child) => is(child, 'bpmn:Artifact')
        ),
        getBBox(spaceRoot)
      )
    );
  }

  const elementsToMove = [ ...elements, ...enclosedArtifacts ];

  var adjustments = SpaceTool.prototype.calculateAdjustments.call(this, elementsToMove, axis, delta, start);

  // do not resize:
  //
  // * text annotations (horizontally/vertically)
  // * empty horizontal pools (vertically)
  // * empty vertical pools (horizontally)
  adjustments.resizingShapes = adjustments.resizingShapes.filter(function(shape) {

    if (is(shape, 'bpmn:TextAnnotation')) {
      return false;
    }

    if (isCollapsedPool(shape)) {
      if (axis === 'y' && isHorizontal(shape) || axis === 'x' && !isHorizontal(shape)) {
        return false;
      }
    }

    return true;
  });

  return adjustments;
};

}
