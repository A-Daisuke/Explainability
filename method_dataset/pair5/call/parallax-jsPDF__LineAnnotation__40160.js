            function LineAnnotation(parameters) {
              var _this9;

              _classCallCheck(this, LineAnnotation);

              _this9 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(LineAnnotation).call(this, parameters)
              );
              _this9.data.annotationType = _util.AnnotationType.LINE;
              var dict = parameters.dict;
              _this9.data.lineCoordinates = _util.Util.normalizeRect(
                dict.getArray("L")
              );

              _this9._preparePopup(dict);

              return _this9;
            }
