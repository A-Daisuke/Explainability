var VAR_1 = "1/12/2012";
var VAR_2 = "5";
var VAR_3 = isNaN(VAR_1),
  VAR_4 = isNaN(VAR_2);
if (VAR_3) {
  var VAR_5 = new Date(VAR_1);
  VAR_1 = isNaN(VAR_5.getTime()) ? VAR_1 : VAR_5;
}
if (VAR_4) {
  var VAR_6 = new Date(VAR_2);
  VAR_2 = isNaN(VAR_6.getTime()) ? VAR_2 : VAR_6;
}
