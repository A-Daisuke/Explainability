export default function SubProcessPlaneBehavior(
    canvas, eventBus, modeling,
    elementFactory, bpmnFactory, bpmnjs, elementRegistry) {

  CommandInterceptor.call(this, eventBus);

  this._canvas = canvas;
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._elementFactory = elementFactory;
  this._bpmnFactory = bpmnFactory;
  this._bpmnjs = bpmnjs;
  this._elementRegistry = elementRegistry;

  var self = this;

  function isCollapsedSubProcess(element) {
    return is(element, 'bpmn:SubProcess') && !isExpanded(element);
  }

  function createRoot(context) {
    var shape = context.shape,
        rootElement = context.newRootElement;

    var businessObject = getBusinessObject(shape);

    rootElement = self._addDiagram(rootElement || businessObject);

    context.newRootElement = canvas.addRootElement(rootElement);
  }

  function removeRoot(context) {
    var shape = context.shape;

    var businessObject = getBusinessObject(shape);
    self._removeDiagram(businessObject);

    var rootElement = context.newRootElement = elementRegistry.get(getPlaneIdFromShape(businessObject));

    canvas.removeRootElement(rootElement);
  }

  // add plane elements for newly created sub-processes
  // this ensures we can actually drill down into the element
  this.executed('shape.create', function(context) {
    var shape = context.shape;
    if (!isCollapsedSubProcess(shape)) {
      return;
    }

    createRoot(context);
  }, true);


  this.postExecuted('shape.create', function(context) {
    var shape = context.shape,
        rootElement = context.newRootElement;

    if (!rootElement || !shape.children) {
      return;
    }

    self._showRecursively(shape.children);

    self._moveChildrenToShape(shape, rootElement);
  }, true);


  this.reverted('shape.create', function(context) {
    var shape = context.shape;
    if (!isCollapsedSubProcess(shape)) {
      return;
    }

    removeRoot(context);
  }, true);


  this.preExecuted('shape.delete', function(context) {
    var shape = context.shape;
    if (!isCollapsedSubProcess(shape)) {
      return;
    }

    var attachedRoot = elementRegistry.get(getPlaneIdFromShape(shape));

    if (!attachedRoot) {
      return;
    }

    modeling.removeElements(attachedRoot.children.slice());
  }, true);


  this.executed('shape.delete', function(context) {
    var shape = context.shape;
    if (!isCollapsedSubProcess(shape)) {
      return;
    }
    removeRoot(context);
  }, true);


  this.reverted('shape.delete', function(context) {
    var shape = context.shape;
    if (!isCollapsedSubProcess(shape)) {
      return;
    }

    createRoot(context);
  }, true);


  this.preExecuted('shape.replace', function(context) {
    var oldShape = context.oldShape;
    var newShape = context.newShape;

    if (!isCollapsedSubProcess(oldShape) || !isCollapsedSubProcess(newShape)) {
      return;
    }

    // old plane could have content,
    // we remove it so it is not recursively deleted from 'shape.delete'
    context.oldRoot = canvas.removeRootElement(getPlaneIdFromShape(oldShape));
  }, true);


  this.postExecuted('shape.replace', function(context) {
    var newShape = context.newShape,
        source = context.oldRoot,
        target = canvas.findRoot(getPlaneIdFromShape(newShape));

    if (!source || !target) {
      return;
    }
    var elements = source.children;

    modeling.moveElements(elements, { x: 0, y: 0 }, target);
  }, true);


  // rename primary elements when the secondary element changes
  // this ensures rootElement.id = element.id + '_plane'
  this.executed('element.updateProperties', function(context) {
    var shape = context.element;

    if (!is(shape, 'bpmn:SubProcess')) {
      return;
    }

    var properties = context.properties;
    var oldProperties = context.oldProperties;

    var oldId = oldProperties.id,
        newId = properties.id;

    if (oldId === newId) {
      return;
    }

    if (isPlane(shape)) {
      elementRegistry.updateId(shape, toPlaneId(newId));
      elementRegistry.updateId(oldId, newId);

      return;
    }

    var planeElement = elementRegistry.get(toPlaneId(oldId));

    if (!planeElement) {
      return;
    }

    elementRegistry.updateId(toPlaneId(oldId), toPlaneId(newId));
  }, true);


  this.reverted('element.updateProperties', function(context) {
    var shape = context.element;

    if (!is(shape, 'bpmn:SubProcess')) {
      return;
    }

    var properties = context.properties;
    var oldProperties = context.oldProperties;

    var oldId = oldProperties.id,
        newId = properties.id;

    if (oldId === newId) {
      return;
    }

    if (isPlane(shape)) {
      elementRegistry.updateId(shape, toPlaneId(oldId));
      elementRegistry.updateId(newId, oldId);

      return;
    }

    var planeElement = elementRegistry.get(toPlaneId(newId));

    if (!planeElement) {
      return;
    }

    elementRegistry.updateId(planeElement, toPlaneId(oldId));
  }, true);

  // re-throw element.changed to re-render primary shape if associated plane has
  // changed (e.g. bpmn:name property has changed)
  eventBus.on('element.changed', function(context) {
    var element = context.element;

    if (!isPlane(element)) {
      return;
    }

    var plane = element;

    var primaryShape = elementRegistry.get(getShapeIdFromPlane(plane));

    // do not re-throw if no associated primary shape (e.g. bpmn:Process)
    if (!primaryShape || primaryShape === plane) {
      return;
    }

    eventBus.fire('element.changed', { element: primaryShape });
  });


  // create/remove plane for the subprocess
  this.executed('shape.toggleCollapse', LOW_PRIORITY, function(context) {
    var shape = context.shape;

    if (!is(shape, 'bpmn:SubProcess')) {
      return;
    }

    if (!isExpanded(shape)) {
      createRoot(context);
      self._showRecursively(shape.children);
    } else {
      removeRoot(context);
    }

  }, true);


  // create/remove plane for the subprocess
  this.reverted('shape.toggleCollapse', LOW_PRIORITY, function(context) {
    var shape = context.shape;

    if (!is(shape, 'bpmn:SubProcess')) {
      return;
    }

    if (!isExpanded(shape)) {
      createRoot(context);
      self._showRecursively(shape.children);
    } else {
      removeRoot(context);
    }

  }, true);

  // move elements between planes
  this.postExecuted('shape.toggleCollapse', HIGH_PRIORITY, function(context) {
    var shape = context.shape;

    if (!is(shape, 'bpmn:SubProcess')) {
      return;
    }

    var rootElement = context.newRootElement;

    if (!rootElement) {
      return;
    }

    if (!isExpanded(shape)) {

      // collapsed
      self._moveChildrenToShape(shape, rootElement);

    } else {
      self._moveChildrenToShape(rootElement, shape);
    }
  }, true);


  // copy-paste ///////////

  // add elements in plane to tree
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

  // set plane children as direct children of collapsed shape
  eventBus.on('copyPaste.copyElement', function(context) {
    var descriptor = context.descriptor,
        element = context.element,
        elements = context.elements;

    var parent = element.parent;

    var isPlane = is(getDi(parent), 'bpmndi:BPMNPlane');
    if (!isPlane) {
      return;
    }

    var parentId = getShapeIdFromPlane(parent);

    var referencedShape = find(elements, function(element) {
      return element.id === parentId;
    });

    if (!referencedShape) {
      return;
    }

    descriptor.parent = referencedShape.id;
  });

  // hide children during pasting
  eventBus.on('copyPaste.pasteElement', function(context) {
    var descriptor = context.descriptor;

    if (!descriptor.parent) {
      return;
    }

    if (isCollapsedSubProcess(descriptor.parent) || descriptor.parent.hidden) {
      descriptor.hidden = true;
    }
  });

}
