var VAR_1 = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};
var VAR_2 = [0, 1, 2, 3, 4];
var VAR_3 = 0;
function FUNCTION_1(VAR_4, VAR_5) {
  for (var VAR_6 = 0, VAR_7 = VAR_4.length; VAR_6 < VAR_7; VAR_6++) {
    (function (VAR_8, VAR_9) {
      setTimeout(function () {
        VAR_5(VAR_9, VAR_8);
      }, 0);
    })(VAR_6, VAR_4[VAR_6]);
  }
}
FUNCTION_1(VAR_2, function () {
  VAR_3++;
});
