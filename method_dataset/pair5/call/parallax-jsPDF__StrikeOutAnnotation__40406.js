            function StrikeOutAnnotation(parameters) {
              var _this18;

              _classCallCheck(this, StrikeOutAnnotation);

              _this18 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(StrikeOutAnnotation).call(this, parameters)
              );
              _this18.data.annotationType = _util.AnnotationType.STRIKEOUT;

              _this18._preparePopup(parameters.dict);

              return _this18;
            }
