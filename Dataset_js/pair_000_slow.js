var FUNCTION_1 = function () {
  return function () {
    alert("hi");
  };
};
function FUNCTION_2() {
  return function () {
    alert("hi");
  };
}
function FUNCTION_3() {
  var VAR_1 = "hi";
  return function () {
    alert(VAR_1);
  };
}
var VAR_2 = FUNCTION_3();
