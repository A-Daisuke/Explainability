              function IsWritableStream(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_writableStreamController"
                  )
                ) {
                  return false;
                }

                return true;
              }
