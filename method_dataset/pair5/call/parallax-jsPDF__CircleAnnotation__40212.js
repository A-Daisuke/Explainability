            function CircleAnnotation(parameters) {
              var _this11;

              _classCallCheck(this, CircleAnnotation);

              _this11 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(CircleAnnotation).call(this, parameters)
              );
              _this11.data.annotationType = _util.AnnotationType.CIRCLE;

              _this11._preparePopup(parameters.dict);

              return _this11;
            }
