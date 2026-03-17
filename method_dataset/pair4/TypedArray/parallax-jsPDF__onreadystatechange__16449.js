function __method_wrapper__() {
                                      request.onreadystatechange = function() {
                                        if (
                                          request.readyState !==
                                          XMLHttpRequest.DONE
                                        ) {
                                          return;
                                        }

                                        if (
                                          request.status === 200 ||
                                          request.status === 0
                                        ) {
                                          var cMapData;

                                          if (
                                            _this.isCompressed &&
                                            request.response
                                          ) {
                                            cMapData = new Uint8Array(
                                              request.response
                                            );
                                          } else if (
                                            !_this.isCompressed &&
                                            request.responseText
                                          ) {
                                            cMapData = (0, _util.stringToBytes)(
                                              request.responseText
                                            );
                                          }

                                          if (cMapData) {
                                            resolve({
                                              cMapData: cMapData,
                                              compressionType: compressionType
                                            });
                                            return;
                                          }
                                        }

                                        reject(new Error(request.statusText));
                                      };

}
