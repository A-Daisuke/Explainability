            function CircleAnnotationElement(parameters) {
              _classCallCheck(this, CircleAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(CircleAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
            }
