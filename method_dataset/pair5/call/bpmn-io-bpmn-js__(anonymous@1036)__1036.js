function __method_wrapper__() {
  return diagram.invoke(function(elementRegistry) {

    // verify model is consistent
    expect(parent.children).to.eql(children);

    // verify SVG is consistent
    var parentGfx = elementRegistry.getGraphics(parent);

    var expectedChildrenGfx = children.map(function(c) {
      return elementRegistry.getGraphics(c);
    });

    var childrenContainerGfx =
      domMatches(parentGfx, '[data-element-id="Process_1"]')
        ? parentGfx
        : getChildrenGfx(parentGfx);

    var existingChildrenGfx = Array.prototype.map.call(childrenContainerGfx.childNodes, function(c) {
      return c.querySelector('.djs-element');
    });

    expect(existingChildrenGfx).to.eql(expectedChildrenGfx);
  });

}
