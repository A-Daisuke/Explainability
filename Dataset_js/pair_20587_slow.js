const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "brix",
          KEY_2: 42,
          KEY_3: "3939382828292",
        };
        var VAR_2 = (function serializeQuery(VAR_3) {
          var VAR_4 = [];
          for (var VAR_5 in VAR_3)
            if (VAR_3.hasOwnProperty(VAR_5)) {
              VAR_4.push(encodeURIComponent(VAR_5) + "=" + encodeURIComponent(VAR_3[VAR_5]));
            }
          return VAR_4.join("&");
        })(VAR_1);
    }
};