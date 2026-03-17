              function IsReadableStreamBYOBRequest(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_associatedReadableByteStreamController"
                  )
                ) {
                  return false;
                }

                return true;
              }
