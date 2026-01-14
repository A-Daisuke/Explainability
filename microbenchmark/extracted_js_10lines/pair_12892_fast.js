const Benchmark = {
    run: function() {
        const FUNCTION_1 = (VAR_1) => {
          if (VAR_1) {
            if (VAR_1.genre && VAR_1.state && VAR_1.city) {
              return `/top-clipes/${VAR_1.genre}/${VAR_1.state}/${VAR_1.city}/`;
            } else if (VAR_1.state && VAR_1.city) {
              return `/top-clipes/${VAR_1.state}/${VAR_1.city}/`;
            } else if (VAR_1.genre && VAR_1.state) {
              return `/top-clipes/${VAR_1.genre}/${VAR_1.state}/`;
            } else if (VAR_1.genre) {
              return `/top-clipes/${VAR_1.genre}/`;
            }
          }
          return "/top-clipes/";
        };
        FUNCTION_1();
    }
};