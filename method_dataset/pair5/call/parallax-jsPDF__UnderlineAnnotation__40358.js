            function UnderlineAnnotation(parameters) {
              var _this16;

              _classCallCheck(this, UnderlineAnnotation);

              _this16 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(UnderlineAnnotation).call(this, parameters)
              );
              _this16.data.annotationType = _util.AnnotationType.UNDERLINE;

              _this16._preparePopup(parameters.dict);

              return _this16;
            }
