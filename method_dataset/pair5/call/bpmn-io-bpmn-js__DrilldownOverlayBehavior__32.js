export default function DrilldownOverlayBehavior(
    canvas, eventBus, elementRegistry, overlays, translate
) {
  CommandInterceptor.call(this, eventBus);

  this._canvas = canvas;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._overlays = overlays;
  this._translate = translate;

  var self = this;

  this.executed('shape.toggleCollapse', LOW_PRIORITY, function(context) {
    var shape = context.shape;

    // Add overlay to the collapsed shape
    if (self._canDrillDown(shape)) {
      self._addOverlay(shape);
    } else {
      self._removeOverlay(shape);
    }
  }, true);


  this.reverted('shape.toggleCollapse', LOW_PRIORITY, function(context) {
    var shape = context.shape;

    // Add overlay to the collapsed shape
    if (self._canDrillDown(shape)) {
      self._addOverlay(shape);
    } else {
      self._removeOverlay(shape);
    }
  }, true);


  this.executed([ 'shape.create', 'shape.move', 'shape.delete' ], LOW_PRIORITY,
    function(context) {
      var oldParent = context.oldParent,
          newParent = context.newParent || context.parent,
          shape = context.shape;

      // Add overlay to the collapsed shape
      if (self._canDrillDown(shape)) {
        self._addOverlay(shape);
      }

      self._updateDrilldownOverlay(oldParent);
      self._updateDrilldownOverlay(newParent);
      self._updateDrilldownOverlay(shape);
    }, true);


  this.reverted([ 'shape.create', 'shape.move', 'shape.delete' ], LOW_PRIORITY,
    function(context) {
      var oldParent = context.oldParent,
          newParent = context.newParent || context.parent,
          shape = context.shape;

      // Add overlay to the collapsed shape
      if (self._canDrillDown(shape)) {
        self._addOverlay(shape);
      }

      self._updateDrilldownOverlay(oldParent);
      self._updateDrilldownOverlay(newParent);
      self._updateDrilldownOverlay(shape);
    }, true);


  eventBus.on('import.render.complete', function() {
    elementRegistry.filter(function(e) {
      return self._canDrillDown(e);
    }).map(function(el) {
      self._addOverlay(el);
    });
  });

}
