var VAR_1 = new String("test");
var VAR_2 = new Number(42);
var VAR_3 = new ArrayBuffer();
var FUNCTION_1 = function (VAR_4) {
  return VAR_4.constructor.toString().match(/\s+([\w\$]+)\s*(?=\()/)[1];
};
var FUNCTION_2 = function (VAR_5) {
  var VAR_6 = VAR_4.constructor.toString();
  return VAR_6.slice(9, VAR_6.indexOf("("));
};
FUNCTION_1(VAR_1);
FUNCTION_1(VAR_2);
FUNCTION_1(VAR_3);
