const Benchmark = {
    run: function() {
        var VAR_1 = [
          {
            KEY_1: function () {},
          },
          { KEY_2: "toto" },
        ];
        var VAR_2 = [
          {
            KEY_3: function () {},
          },
          {
            KEY_4: function () {},
          },
        ];
        for (var VAR_3 = 0, VAR_4 = VAR_2.length; VAR_3 < VAR_4; ++VAR_3) {
          var VAR_5 = VAR_2[VAR_3];
          try {
            VAR_5.KEY_1();
          } catch (VAR_6) {}
        }
    }
};