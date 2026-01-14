const Benchmark = {
    run: function() {
        var VAR_1 = "a";
        var VAR_2 = "aaaaaaaaaa";
        var VAR_3 = 0;
        var VAR_4 = "0000000000";
        switch (VAR_1) {
          case "d":
            document.write("found!");
            break;
          case "c":
            document.write("found!");
            break;
          case "b":
            document.write("found!");
            break;
          case "a":
            break;
        }
    }
};