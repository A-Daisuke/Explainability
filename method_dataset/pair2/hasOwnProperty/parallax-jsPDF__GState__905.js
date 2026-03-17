function GState(parameters) {
  if (!(this instanceof GState)) {
    return new GState(parameters);
  }

  /**
   * @name GState#opacity
   * @type {any}
   */
  /**
   * @name GState#stroke-opacity
   * @type {any}
   */
  var supported = "opacity,stroke-opacity".split(",");
  for (var p in parameters) {
    if (parameters.hasOwnProperty(p) && supported.indexOf(p) >= 0) {
      this[p] = parameters[p];
    }
  }
  /**
   * @name GState#id
   * @type {string}
   */
  this.id = ""; // set by addGState()
  /**
   * @name GState#objectNumber
   * @type {number}
   */
  this.objectNumber = -1; // will be set by putGState()
}
