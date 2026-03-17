            function HighlightAnnotationElement(parameters) {
              _classCallCheck(this, HighlightAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(HighlightAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
            }
