function __method_wrapper__() {
  eventBus.on('copyPaste.createTree', function(context) {
    var element = context.element,
        children = context.children;

    if (!isCollapsedSubProcess(element)) {
      return;
    }

    var id = getPlaneIdFromShape(element);
    var parent = elementRegistry.get(id);

    if (parent) {

      // do not copy invisible root element
      children.push.apply(children, parent.children);
    }
  });

}
