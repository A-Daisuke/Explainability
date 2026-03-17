            function ButtonWidgetAnnotation(params) {
              var _this4;

              _classCallCheck(this, ButtonWidgetAnnotation);

              _this4 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(ButtonWidgetAnnotation).call(this, params)
              );
              _this4.data.checkBox =
                !_this4.hasFieldFlag(_util.AnnotationFieldFlag.RADIO) &&
                !_this4.hasFieldFlag(_util.AnnotationFieldFlag.PUSHBUTTON);
              _this4.data.radioButton =
                _this4.hasFieldFlag(_util.AnnotationFieldFlag.RADIO) &&
                !_this4.hasFieldFlag(_util.AnnotationFieldFlag.PUSHBUTTON);
              _this4.data.pushButton = _this4.hasFieldFlag(
                _util.AnnotationFieldFlag.PUSHBUTTON
              );

              if (_this4.data.checkBox) {
                _this4._processCheckBox(params);
              } else if (_this4.data.radioButton) {
                _this4._processRadioButton(params);
              } else if (_this4.data.pushButton) {
                _this4._processPushButton(params);
              } else {
                (0, _util.warn)(
                  "Invalid field flags for button widget annotation"
                );
              }

              return _this4;
            }
