function __method_wrapper__() {
LoggingCroppingConnectionDocking.prototype._getIntersection = function(shape, connection, takeFirst) {

  var intersection = CroppingConnectionDocking.prototype._getIntersection.call(this, shape, connection, takeFirst);

  if (!intersection) {

    if (getOrientation(connection.source, connection.target) !== 'intersect') {
      window.noIntersectCount++;

      window.noIntersect.push([
        connection,
        this._getShapePath(shape),
        this._getConnectionPath(connection)
      ]);
    }
  }

  return intersection;
};
}
