(function () {
  var VAR_1 = "";
  var VAR_2 = new Array(7000 * 7);
  for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {
    VAR_2.push("Quick ");
    VAR_2.push(VAR_3);
    VAR_2.push(" fox ");
    VAR_2.push(VAR_3);
    VAR_2.push(" over the ");
    VAR_2.push(VAR_3);
    VAR_2.push(" dog. ");
  }
  for (var VAR_4 = 0; VAR_3 < VAR_2.length; VAR_3++) {
    VAR_1 += VAR_2[VAR_3];
  }
})();
