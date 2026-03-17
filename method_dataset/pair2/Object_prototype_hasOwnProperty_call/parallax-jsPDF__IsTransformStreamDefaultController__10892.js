              function IsTransformStreamDefaultController(x) {
                if (!typeIsObject(x)) {
                  return false;
                }

                if (
                  !Object.prototype.hasOwnProperty.call(
                    x,
                    "_controlledTransformStream"
                  )
                ) {
                  return false;
                }

                return true;
              }
