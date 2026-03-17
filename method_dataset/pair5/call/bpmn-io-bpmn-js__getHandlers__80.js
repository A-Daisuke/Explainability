function __method_wrapper__() {
Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['element.updateModdleProperties'] = UpdateModdlePropertiesHandler;
  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['canvas.updateRoot'] = UpdateCanvasRootHandler;
  handlers['lane.add'] = AddLaneHandler;
  handlers['lane.resize'] = ResizeLaneHandler;
  handlers['lane.split'] = SplitLaneHandler;
  handlers['lane.updateRefs'] = UpdateFlowNodeRefsHandler;
  handlers['id.updateClaim'] = IdClaimHandler;
  handlers['element.setColor'] = SetColorHandler;
  handlers['element.updateLabel'] = UpdateLabelHandler;

  return handlers;
};

}
