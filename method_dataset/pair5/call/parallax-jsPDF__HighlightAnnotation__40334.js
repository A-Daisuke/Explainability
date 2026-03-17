            function HighlightAnnotation(parameters) {
              var _this15;

              _classCallCheck(this, HighlightAnnotation);

              _this15 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(HighlightAnnotation).call(this, parameters)
              );
              _this15.data.annotationType = _util.AnnotationType.HIGHLIGHT;

              _this15._preparePopup(parameters.dict);

              return _this15;
            }
