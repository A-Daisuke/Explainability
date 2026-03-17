export default function CustomUpdater(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  function updateTriangle(evt) {
    var context = evt.context,
        shape = context.shape,
        businessObject = shape.businessObject,
        leader = businessObject.leader,
        companions,
        parent,
        idx;

    if (!isCustom(shape, 'custom:triangle')) {
      return;
    }

    parent = shape.parent;

    if (!parent) {
      return;
    }

    if (isBpmn(parent, 'bpmn:SubProcess')) {
      shape.businessObject.foo = 'geil';
    }

    if (!isBpmn(parent, 'bpmn:SubProcess')) {
      shape.businessObject.foo = 'bar';
    }

    if (isCustom(parent, 'custom:circle')) {
      shape.businessObject.leader = parent;

      if (!parent.businessObject.companions) {
        parent.businessObject.companions = [];
      }
      parent.businessObject.companions.push(shape);
    }

    if (!isCustom(parent, 'custom:circle') && leader) {
      companions = leader.businessObject.companions;

      idx = companions.indexOf(shape);

      companions.splice(idx, 1);

      businessObject.leader = '';
    }
  }

  this.executed([
    'shape.move',
    'shape.create'
  ], ifCustomElement(updateTriangle));


  /**
   * When morphing a Process into a Collaboration or vice-versa,
   * make sure that the existing custom elements get their parents updated.
   */
  function updateCustomElementsRoot(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        newRoot = context.newRoot,
        children = oldRoot.children;

    var customChildren = children.filter(isCustom);

    if (customChildren.length) {
      modeling.moveElements(customChildren, { x: 0, y: 0 }, newRoot);
    }
  }

  this.postExecute('canvas.updateRoot', updateCustomElementsRoot);
}
