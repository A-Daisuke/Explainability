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
      for (var VAR_6 = 0; VAR_6 < VAR_2.length; VAR_6++) {
        var VAR_7 = VAR_2[VAR_6];
        if (VAR_7["iata"] === VAR_3) {
          return VAR_7;
        }
      }
      return null;
    }
    FUNCTION_1(VAR_1, "UTK");
    }
};
