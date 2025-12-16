const Benchmark = {
    run: function() {
    var VAR_1 = "http://www.google.es/?test=1";
    var VAR_2 = "/?";
    var VAR_3 = "?";
    var VAR_4 = "";
    var VAR_5 = {};
    var FUNCTION_1 = function (VAR_6) {
      if (typeof VAR_5[VAR_1] !== "undefined") {
        return VAR_5[VAR_1];
      }
      VAR_5[VAR_7] = VAR_1.replace(VAR_2, VAR_3);
      return VAR_5[VAR_1];
    };
    VAR_4 = VAR_1.replace(VAR_2, VAR_3);
    }
};
