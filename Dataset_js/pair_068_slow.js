function FUNCTION_1() {
  var VAR_1 = "0";
  var VAR_2 = [];
  for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {
    var VAR_4 = VAR_1.split(",");
    var VAR_5 = VAR_4[VAR_4.length - 1];
    if (VAR_5) {
      VAR_2.push(VAR_5);
    }
    VAR_1 += "," + VAR_3;
  }
}
FUNCTION_1();
