            function ChoiceWidgetAnnotation(params) {
              var _this5;

              _classCallCheck(this, ChoiceWidgetAnnotation);

              _this5 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(ChoiceWidgetAnnotation).call(this, params)
              );
              _this5.data.options = [];
              var options = (0, _core_utils.getInheritableProperty)({
                dict: params.dict,
                key: "Opt"
              });

              if (Array.isArray(options)) {
                var xref = params.xref;

                for (var i = 0, ii = options.length; i < ii; i++) {
                  var option = xref.fetchIfRef(options[i]);
                  var isOptionArray = Array.isArray(option);
                  _this5.data.options[i] = {
                    exportValue: isOptionArray
                      ? xref.fetchIfRef(option[0])
                      : option,
                    displayValue: (0, _util.stringToPDFString)(
                      isOptionArray ? xref.fetchIfRef(option[1]) : option
                    )
                  };
                }
              }

              if (!Array.isArray(_this5.data.fieldValue)) {
                _this5.data.fieldValue = [_this5.data.fieldValue];
              }

              _this5.data.combo = _this5.hasFieldFlag(
                _util.AnnotationFieldFlag.COMBO
              );
              _this5.data.multiSelect = _this5.hasFieldFlag(
                _util.AnnotationFieldFlag.MULTISELECT
              );
              return _this5;
            }
