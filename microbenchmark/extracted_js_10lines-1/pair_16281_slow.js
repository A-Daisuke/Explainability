const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 10,
          KEY_2: "kiddi",
          KEY_3: "2014-12-12 00:00:00",
        };
        var VAR_2 =
          '<tr data-id="{ID}"><td style="padding-right:20px;">{USERNAME}</td><td>{DATE}</td></tr>';
        var VAR_3 =
          '<tr data-id="10"><td style="padding-right:20px;">kiddi</td><td>2014-12-12 00:00:00</td></tr>';
        for (var VAR_4 in VAR_1) {
          if (VAR_1.hasOwnProperty(VAR_4)) {
            VAR_2 = VAR_2
              .split("{" + VAR_4.toUpperCase() + "}")
              .join(VAR_1[VAR_4]);
          }
        }
    }
};