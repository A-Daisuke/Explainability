            function TextAnnotationElement(parameters) {
              _classCallCheck(this, TextAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(TextAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable
                )
              );
            }
