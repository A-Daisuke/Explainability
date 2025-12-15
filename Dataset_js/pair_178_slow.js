function FUNCTION_1() {
  var VAR_1 = 0;
  for (var VAR_2 = 0; VAR_2 < 10; VAR_2++) {
    function FUNCTION_2(VAR_3, VAR_4) {
      return VAR_3 + VAR_4;
    }
    VAR_1 = FUNCTION_2(VAR_1, VAR_2);
  }
}
FUNCTION_1();
