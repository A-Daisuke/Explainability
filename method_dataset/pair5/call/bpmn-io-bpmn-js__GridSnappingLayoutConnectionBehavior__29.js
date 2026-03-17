export default function GridSnappingLayoutConnectionBehavior(eventBus, gridSnapping, modeling) {
  CommandInterceptor.call(this, eventBus);

  this._gridSnapping = gridSnapping;

  var self = this;

  this.postExecuted([
    'connection.create',
    'connection.layout'
  ], HIGH_PRIORITY, function(event) {
    var context = event.context,
        connection = context.connection,
        hints = context.hints || {},
        waypoints = connection.waypoints;

    if (hints.connectionStart || hints.connectionEnd || hints.createElementsBehavior === false) {
      return;
    }

    if (!hasMiddleSegments(waypoints)) {
      return;
    }

    modeling.updateWaypoints(connection, self.snapMiddleSegments(waypoints));
  });
}
