function FUNCTION_1() {
  var VAR_2 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (VAR_3) {
      var VAR_4 = (Math.random() * 16) | 0,
        VAR_5 = VAR_3 == "x" ? VAR_4 : (VAR_4 & 3) | 8;
      return VAR_5.toString(16);
    },
  );
  return VAR_2;
}
FUNCTION_1();
