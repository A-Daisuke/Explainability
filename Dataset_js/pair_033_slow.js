function FUNCTION_1() {
  var VAR_1 = new Date().getTime();
  var VAR_2 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (VAR_3) {
      var VAR_4 = (VAR_1 + Math.random() * 16) % 16 | 0;
      VAR_1 = Math.floor(VAR_1 / 16);
      return (VAR_3 == "x" ? VAR_4 : (VAR_4 & 3) | 8).toString(16);
    },
  );
  return VAR_2;
}
FUNCTION_1();
