const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: [817, 725, 338],
          KEY_2: [605, 712, 327],
          KEY_3: [813, 724, 430],
          KEY_4: [608, 716, 329],
        };
        var VAR_2 = 83;
        if (~VAR_1.KEY_1.indexOf(VAR_2)) var VAR_3 = "up";
        else if (~VAR_1.KEY_2.indexOf(VAR_2)) var VAR_4 = "left";
        else if (~VAR_1.KEY_4.indexOf(VAR_2)) var VAR_5 = "right";
        else if (~VAR_1.KEY_3.indexOf(VAR_2)) var VAR_6 = "down";
    }
};