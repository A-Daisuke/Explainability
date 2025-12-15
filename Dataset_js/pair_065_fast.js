(function (VAR_6, VAR_7) {
  var VAR_8 = 0;
  for (var VAR_9 = 0; VAR_9 < 1000; ++VAR_9) {
    for (var VAR_10 = 0; VAR_10 < VAR_6; ++VAR_10) {
      if (VAR_7[0][0] != VAR_10) {
        VAR_7[0][0] -= VAR_7[1][0];
        VAR_7[0][1] -= VAR_7[1][1];
      }
    }
  }
})(100, [
  [10, 10],
  [1, 1],
]);
