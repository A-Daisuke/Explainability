const __obj__ = {
                    get: function get() {
                      if (IsReadableByteStreamController(this) === false) {
                        throw byteStreamControllerBrandCheckException(
                          "byobRequest"
                        );
                      }

                      if (
                        this._byobRequest === undefined &&
                        this._pendingPullIntos.length > 0
                      ) {
                        var firstDescriptor = this._pendingPullIntos[0];
                        var view = new Uint8Array(
                          firstDescriptor.buffer,
                          firstDescriptor.byteOffset +
                            firstDescriptor.bytesFilled,
                          firstDescriptor.byteLength -
                            firstDescriptor.bytesFilled
                        );
                        this._byobRequest = new ReadableStreamBYOBRequest(
                          this,
                          view
                        );
                      }

                      return this._byobRequest;
                    }

};
