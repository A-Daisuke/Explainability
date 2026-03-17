            function SquareAnnotationElement(parameters) {
              _classCallCheck(this, SquareAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(SquareAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
            }
