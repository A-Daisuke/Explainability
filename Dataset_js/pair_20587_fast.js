const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "brix",
          KEY_2: 42,
          KEY_3: "3939382828292",
        };
        var VAR_2 = (function serializeQuery(VAR_3) {
          return Object.keys(VAR_3)
            .reduce(function (VAR_6, VAR_7) {
              VAR_6.push(VAR_7 + "=" + encodeURIComponent(VAR_3[VAR_7]));
              return VAR_6;
            }, [])
            .join("&");
        })(VAR_1);
    }
};