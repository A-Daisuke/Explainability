var VAR_1 = {
  KEY_1: 0,
  KEY_2: { KEY_3: 10 },
  KEY_4: function (VAR_2) {
    this.KEY_1 += VAR_2 + this.KEY_2.KEY_3;
  },
};
function FUNCTION_1(VAR_3) {
  VAR_3();
}
var VAR_4 = 10;
var VAR_5 = VAR_1.KEY_4.bind(VAR_1, VAR_4);
var FUNCTION_2 = function () {
  VAR_1.KEY_4(VAR_4);
};
var FUNCTION_4 = function () {
  VAR_1.KEY_4.apply(VAR_1, [VAR_4]);
};
var FUNCTION_5 = function () {
  VAR_1.KEY_4.call(VAR_1, VAR_4);
};
FUNCTION_1(VAR_5);
