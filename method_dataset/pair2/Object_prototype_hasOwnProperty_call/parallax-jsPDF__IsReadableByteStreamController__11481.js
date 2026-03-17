              function IsReadableByteStreamController(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_underlyingByteSource"
                  )
                ) {
                  return false;
                }

                return true;
              }
