const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "a",
          KEY_2: "b",
          KEY_3: "c",
        };
        var VAR_9 = {
          KEY_4: "onclick",
          KEY_5: "ondblclick",
          KEY_6: "onmouseover",
        };
        var VAR_2 = "click",
          VAR_3 = "dblclick";
        var VAR_4 = ["onclick", "dblclick", "mouseover"];
        var VAR_5 = 0,
          VAR_6 = 1;
        var VAR_7 = "onclick",
          VAR_8 = "ondblclick";
        VAR_1[VAR_9["click"]];
        VAR_1[VAR_9["dblclick"]];
    }
};