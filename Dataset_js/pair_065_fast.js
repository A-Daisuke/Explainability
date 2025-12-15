var VAR_1 = "ASP.NET",
  VAR_2 = "PHP";
if (!String.prototype.FUNCTION_1) {
  String.prototype.FUNCTION_1 = function () {
    var VAR_3 = arguments;
    return this.replace(/{(\d+)}/g, function (VAR_4, VAR_5) {
      return typeof VAR_3[VAR_5] !== "undefined" ? VAR_3[VAR_5] : VAR_4;
    });
  };
}
"".concat(VAR_1, " is dead, but ".concat(VAR_2, " is alive! "));
