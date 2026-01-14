const Benchmark = {
    run: function() {
        var VAR_1 = [
          "Frank Jones",
          "Andrew Jackson",
          "George Washington",
          "Abraham Lincoln",
          "Lisa",
          "Betty",
          null,
        ];
        var VAR_2;
        var VAR_3 = false;
        var VAR_4 = "Andrew";
        for (var VAR_5 = 0; VAR_5 < VAR_1.length; ++VAR_5) {
          var VAR_6 = VAR_1[VAR_5];
          VAR_3 = VAR_6 && VAR_6.substr(0, VAR_4.length) === VAR_4;
        }
        VAR_2 = !!VAR_3;
    }
};