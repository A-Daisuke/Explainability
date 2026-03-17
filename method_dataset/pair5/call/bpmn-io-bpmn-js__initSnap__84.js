function __method_wrapper__() {
BpmnCreateMoveSnapping.prototype.initSnap = function(event) {
  var snapContext = CreateMoveSnapping.prototype.initSnap.call(this, event);

  var shape = event.shape;

  var isMove = !!this._elementRegistry.get(shape.id);

  // snap to docking points
  forEach(shape.outgoing, function(connection) {
    var docking = connection.waypoints[0];

    docking = docking.original || docking;

    snapContext.setSnapOrigin(connection.id + '-docking', getDockingSnapOrigin(docking, isMove, event));
  });

  forEach(shape.incoming, function(connection) {
    var docking = connection.waypoints[connection.waypoints.length - 1];

    docking = docking.original || docking;

    snapContext.setSnapOrigin(connection.id + '-docking', getDockingSnapOrigin(docking, isMove, event));
  });

  if (is(shape, 'bpmn:Participant')) {

    // snap to borders with higher priority
    snapContext.setSnapLocations([ 'top-left', 'bottom-right', 'mid' ]);
  }

  return snapContext;
};

}
