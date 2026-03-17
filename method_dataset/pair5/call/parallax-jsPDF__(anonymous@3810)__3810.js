class __C__ {
              microtask(function() {
                var wrapper = {
                  _w: promise,
                  _d: false
                };

                try {
                  then.call(
                    value,
                    ctx($resolve, wrapper, 1),
                    ctx($reject, wrapper, 1)
                  );
                } catch (e) {
                  $reject.call(wrapper, e);
                }
              });

}
