              function IsTransformStream(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_transformStreamController"
                  )
                ) {
                  return false;
                }

                return true;
              }
