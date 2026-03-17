              function IsWritableStreamDefaultWriter(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_ownerWritableStream"
                  )
                ) {
                  return false;
                }

                return true;
              }
