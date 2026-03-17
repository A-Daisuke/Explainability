            function SquigglyAnnotation(parameters) {
              var _this17;

              _classCallCheck(this, SquigglyAnnotation);

              _this17 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(SquigglyAnnotation).call(this, parameters)
              );
              _this17.data.annotationType = _util.AnnotationType.SQUIGGLY;

              _this17._preparePopup(parameters.dict);

              return _this17;
            }
