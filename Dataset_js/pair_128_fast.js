var FUNCTION_1 = function () {
  this.VAR_1 = (Math.random() * 1000) | 0;
};
var VAR_2 = [];
for (var VAR_3 = 0; VAR_3 < 10000; VAR_3++) {
  VAR_2.push(new FUNCTION_1());
}
var VAR_4 = VAR_2[VAR_2.length - 1];
var VAR_5 = -1;
for (var VAR_7 = 0; VAR_3 < VAR_2.length; VAR_3++) {
  if (VAR_4 === VAR_2[VAR_3]) {
    VAR_5 = VAR_3;
    break;
  }
}
