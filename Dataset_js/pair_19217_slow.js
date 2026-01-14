const Benchmark = {
    run: function() {
        var VAR_1 = "touchend";
        var VAR_2 = "touchcancel";
        var VAR_3 = "pointerup";
        if (VAR_1.indexOf("touch") !== -1) {
          var VAR_4 = 1;
        }
        if (VAR_2.indexOf("touch") !== -1) {
          var VAR_5 = 1;
        }
        if (VAR_3.indexOf("touch") !== -1) {
          var VAR_6 = 1;
        }
    }
};