function __method_wrapper__() {
                value: function getBytes(length) {
                  var forceClamped =
                    arguments.length > 1 && arguments[1] !== undefined
                      ? arguments[1]
                      : false;
                  var bytes = this.bytes;
                  var pos = this.pos;
                  var strEnd = this.end;

                  if (!length) {
                    this.ensureRange(pos, strEnd);

                    var _subarray = bytes.subarray(pos, strEnd);

                    return forceClamped
                      ? new Uint8ClampedArray(_subarray)
                      : _subarray;
                  }

                  var end = pos + length;

                  if (end > strEnd) {
                    end = strEnd;
                  }

                  this.ensureRange(pos, end);
                  this.pos = end;
                  var subarray = bytes.subarray(pos, end);
                  return forceClamped
                    ? new Uint8ClampedArray(subarray)
                    : subarray;
                }

}
