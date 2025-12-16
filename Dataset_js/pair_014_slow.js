const Benchmark = {
    run: function() {
    var VAR_1 = [
      {
        KEY_1: "UTK",
        KEY_2: "169.86667",
        KEY_3: "MH",
        KEY_4: 1,
        KEY_5: "Utirik Airport",
        KEY_6: "OC",
        KEY_7: "airport",
        KEY_8: "11.233333",
        KEY_9: "small",
      },
    ];
    function FUNCTION_1(VAR_2, VAR_3) {
      var VAR_4 = VAR_2.filter(function (VAR_5) {
        return (VAR_5.KEY_1 = VAR_3);
      });
      return VAR_4.length == 1 ? VAR_4[0] : undefined;
    }
    FUNCTION_1(VAR_1, "UTK");
    }
};
