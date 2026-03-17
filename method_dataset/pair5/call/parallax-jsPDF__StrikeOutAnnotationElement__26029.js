            function StrikeOutAnnotationElement(parameters) {
              _classCallCheck(this, StrikeOutAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(StrikeOutAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
            }
