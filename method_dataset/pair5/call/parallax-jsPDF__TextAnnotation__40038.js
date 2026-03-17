            function TextAnnotation(parameters) {
              var _this6;

              _classCallCheck(this, TextAnnotation);

              var DEFAULT_ICON_SIZE = 22;
              _this6 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(TextAnnotation).call(this, parameters)
              );
              _this6.data.annotationType = _util.AnnotationType.TEXT;

              if (_this6.data.hasAppearance) {
                _this6.data.name = "NoIcon";
              } else {
                _this6.data.rect[1] = _this6.data.rect[3] - DEFAULT_ICON_SIZE;
                _this6.data.rect[2] = _this6.data.rect[0] + DEFAULT_ICON_SIZE;
                _this6.data.name = parameters.dict.has("Name")
                  ? parameters.dict.get("Name").name
                  : "Note";
              }

              _this6._preparePopup(parameters.dict);

              return _this6;
            }
