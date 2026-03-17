            function SquareAnnotation(parameters) {
              var _this10;

              _classCallCheck(this, SquareAnnotation);

              _this10 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(SquareAnnotation).call(this, parameters)
              );
              _this10.data.annotationType = _util.AnnotationType.SQUARE;

              _this10._preparePopup(parameters.dict);

              return _this10;
            }
