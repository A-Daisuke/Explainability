            function TextWidgetAnnotation(params) {
              var _this3;

              _classCallCheck(this, TextWidgetAnnotation);

              _this3 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(TextWidgetAnnotation).call(this, params)
              );
              var dict = params.dict;
              _this3.data.fieldValue = (0, _util.stringToPDFString)(
                _this3.data.fieldValue || ""
              );
              var alignment = (0, _core_utils.getInheritableProperty)({
                dict: dict,
                key: "Q"
              });

              if (
                !Number.isInteger(alignment) ||
                alignment < 0 ||
                alignment > 2
              ) {
                alignment = null;
              }

              _this3.data.textAlignment = alignment;
              var maximumLength = (0, _core_utils.getInheritableProperty)({
                dict: dict,
                key: "MaxLen"
              });

              if (!Number.isInteger(maximumLength) || maximumLength < 0) {
                maximumLength = null;
              }

              _this3.data.maxLen = maximumLength;
              _this3.data.multiLine = _this3.hasFieldFlag(
                _util.AnnotationFieldFlag.MULTILINE
              );
              _this3.data.comb =
                _this3.hasFieldFlag(_util.AnnotationFieldFlag.COMB) &&
                !_this3.hasFieldFlag(_util.AnnotationFieldFlag.MULTILINE) &&
                !_this3.hasFieldFlag(_util.AnnotationFieldFlag.PASSWORD) &&
                !_this3.hasFieldFlag(_util.AnnotationFieldFlag.FILESELECT) &&
                _this3.data.maxLen !== null;
              return _this3;
            }
