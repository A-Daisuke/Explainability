          function values(iterable) {
            if (iterable) {
              var iteratorMethod = iterable[iteratorSymbol];

              if (iteratorMethod) {
                return iteratorMethod.call(iterable);
              }

              if (typeof iterable.next === "function") {
                return iterable;
              }

              if (!isNaN(iterable.length)) {
                var i = -1,
                  next = function next() {
                    while (++i < iterable.length) {
                      if (hasOwn.call(iterable, i)) {
                        next.value = iterable[i];
                        next.done = false;
                        return next;
                      }
                    }

                    next.value = undefined;
                    next.done = true;
                    return next;
                  };

                return (next.next = next);
              }
            }

            return {
              next: doneResult
            };
          }
