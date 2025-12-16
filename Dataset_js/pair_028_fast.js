const Benchmark = {
    run: function() {
    var VAR_1 = "multi.part.string";
    var VAR_2 = ".";
    var VAR_8 = VAR_2.length;
    function FUNCTION_1(VAR_3, VAR_4) {
      var VAR_5 = VAR_3.indexOf(VAR_4);
      return VAR_5 > -1 ? VAR_3.substring(VAR_5 + VAR_4.length) : VAR_3;
    }
    String.prototype.FUNCTION_2 = function (VAR_6) {
      var VAR_7 = this.indexOf(VAR_6);
      return VAR_7 > -1 ? this.substring(VAR_7 + VAR_4.length) : this;
    };
    VAR_1.substr(VAR_1.indexOf(VAR_2) + VAR_8);
    }
};
