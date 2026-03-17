function __method_wrapper__() {
BpmnCreateMoveSnapping.prototype.addSnapTargetPoints = function(snapPoints, shape, target) {
  CreateMoveSnapping.prototype.addSnapTargetPoints.call(this, snapPoints, shape, target);

  var snapTargets = this.getSnapTargets(shape, target);

  forEach(snapTargets, function(snapTarget) {

    // handle TRBL alignment
    //
    // * with container elements
    // * with text annotations
    if (isContainer(snapTarget) || areAll([ shape, snapTarget ], 'bpmn:TextAnnotation')) {
      snapPoints.add('top-left', topLeft(snapTarget));
      snapPoints.add('bottom-right', bottomRight(snapTarget));
    }
  });

  var elementRegistry = this._elementRegistry;

  // snap to docking points if not create mode
  forEach(shape.incoming, function(connection) {
    if (elementRegistry.get(shape.id)) {

      if (!includes(snapTargets, connection.source)) {
        snapPoints.add('mid', getMid(connection.source));
      }

      var docking = connection.waypoints[0];
      snapPoints.add(connection.id + '-docking', docking.original || docking);
    }
  });

  forEach(shape.outgoing, function(connection) {
    if (elementRegistry.get(shape.id)) {

      if (!includes(snapTargets, connection.target)) {
        snapPoints.add('mid', getMid(connection.target));
      }

      var docking = connection.waypoints[ connection.waypoints.length - 1 ];

      snapPoints.add(connection.id + '-docking', docking.original || docking);
    }
  });

  // add sequence flow parents as snap targets
  if (is(target, 'bpmn:SequenceFlow')) {
    snapPoints = this.addSnapTargetPoints(snapPoints, shape, target.parent);
  }

  return snapPoints;
};

}
