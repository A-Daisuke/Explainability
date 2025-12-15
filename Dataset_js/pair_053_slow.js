function FUNCTION_1(VAR_1, VAR_2) {
  var VAR_3 = VAR_1 || 3,
    VAR_4 = VAR_2 || 5;
  return VAR_1 + VAR_2;
}
function FUNCTION_2(VAR_5) {
  return VAR_5.KEY_1 + VAR_5.KEY_2;
}
function FUNCTION_3(VAR_6) {
  var VAR_7 = VAR_5.KEY_1,
    VAR_8 = VAR_5.KEY_2;
  return VAR_7 + VAR_8;
}
function FUNCTION_4(VAR_9) {
  var VAR_10 = $.extend(
    {
      KEY_1: 3,
      KEY_2: 5,
    },
    VAR_9,
  );
  return VAR_10.KEY_1 + VAR_10.KEY_2;
}
FUNCTION_2({
  KEY_3: Math.random(),
  KEY_4: Math.random(),
});
