            function PopupAnnotation(parameters) {
              var _this8;

              _classCallCheck(this, PopupAnnotation);

              _this8 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PopupAnnotation).call(this, parameters)
              );
              _this8.data.annotationType = _util.AnnotationType.POPUP;
              var dict = parameters.dict;
              var parentItem = dict.get("Parent");

              if (!parentItem) {
                (0, _util.warn)(
                  "Popup annotation has a missing or invalid parent annotation."
                );
                return _possibleConstructorReturn(_this8);
              }

              var parentSubtype = parentItem.get("Subtype");
              _this8.data.parentType = (0, _primitives.isName)(parentSubtype)
                ? parentSubtype.name
                : null;
              _this8.data.parentId = dict.getRaw("Parent").toString();
              _this8.data.title = (0, _util.stringToPDFString)(
                parentItem.get("T") || ""
              );
              _this8.data.contents = (0, _util.stringToPDFString)(
                parentItem.get("Contents") || ""
              );

              if (!parentItem.has("C")) {
                _this8.data.color = null;
              } else {
                _this8.setColor(parentItem.getArray("C"));

                _this8.data.color = _this8.color;
              }

              if (!_this8.viewable) {
                var parentFlags = parentItem.get("F");

                if (_this8._isViewable(parentFlags)) {
                  _this8.setFlags(parentFlags);
                }
              }

              return _this8;
            }
