function __method_wrapper__() {
  GState.prototype.equals = function equals(other) {
    var ignore = "id,objectNumber,equals";
    var p;
    if (!other || _typeof(other) !== _typeof(this)) return false;
    var count = 0;
    for (p in this) {
      if (ignore.indexOf(p) >= 0) continue;
      if (this.hasOwnProperty(p) && !other.hasOwnProperty(p)) return false;
      if (this[p] !== other[p]) return false;
      count++;
    }
    for (p in other) {
      if (other.hasOwnProperty(p) && ignore.indexOf(p) < 0) count--;
    }
    return count === 0;
  };

}
