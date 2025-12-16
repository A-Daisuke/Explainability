const Benchmark = {
    run: function() {
    var VAR_1 = "1/12/2012";
    var VAR_2 = "5";
    var VAR_3 = isNaN(VAR_1),
      VAR_4 = isNaN(VAR_2);
    if (VAR_3) {
      VAR_1 = isNaN(new Date(VAR_1).getTime()) ? VAR_1 : new Date(VAR_1);
    }
    if (VAR_4) {
      VAR_2 = isNaN(new Date(VAR_2).getTime()) ? VAR_2 : new Date(VAR_2);
    }
    }
};
