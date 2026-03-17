function __method_wrapper__() {
                      reader.read().then(function(_ref5) {
                        var _textContent$items;

                        var value = _ref5.value,
                          done = _ref5.done;

                        if (done) {
                          resolve(textContent);
                          return;
                        }

                        Object.assign(textContent.styles, value.styles);

                        (_textContent$items = textContent.items).push.apply(
                          _textContent$items,
                          _toConsumableArray(value.items)
                        );

                        pump();
                      }, reject);

}
