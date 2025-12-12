Array.prototype.FUNCTION_1 = function () {
  return this.concat([].slice.call(arguments)).reduce(function (VAR_1, VAR_2) {
    return VAR_1 + VAR_2;
  });
};
Array.prototype.FUNCTION_2 = function () {
  var VAR_3 = 0,
    VAR_4;
  for (VAR_4 = 0; VAR_4 < this.length; VAR_4++) {
    VAR_3 += this[VAR_4];
  }
  for (VAR_4 = 0; VAR_4 < arguments.length; VAR_4++) {
    VAR_3 += arguments[VAR_4];
  }
  return VAR_3;
};
[3, 6, 1, 4].FUNCTION_2(4, 2);
