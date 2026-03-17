      export const getTime = function (
        runtimeScene: gdjs.RuntimeScene,
        what: string
      ) {
        if (what === 'timestamp') {
          return Date.now();
        }
        const now = new Date();
        if (what === 'hour') {
          return now.getHours();
        } else if (what === 'min') {
          return now.getMinutes();
        } else if (what === 'sec') {
          return now.getSeconds();
        } else if (what === 'mday') {
          return now.getDate();
        } else if (what === 'mon') {
          return now.getMonth();
        } else if (what === 'year') {
          //Conform to the C way of returning years.
          return now.getFullYear() - 1900;
        } else if (what === 'wday') {
          return now.getDay();
        } else if (what === 'yday') {
          const start = new Date(now.getFullYear(), 0, 0);
          const diff = now.getTime() - start.getTime();
          const oneDay = 1000 * 60 * 60 * 24;
          return Math.floor(diff / oneDay);
        }
        return 0;
      };
