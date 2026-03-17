              function IsReadableStream(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_readableStreamController"
                  )
                ) {
                  return false;
                }

                return true;
              }
