            function SquigglyAnnotationElement(parameters) {
              _classCallCheck(this, SquigglyAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(SquigglyAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
            }
