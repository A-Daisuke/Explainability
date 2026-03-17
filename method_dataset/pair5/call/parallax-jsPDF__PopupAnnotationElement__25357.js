            function PopupAnnotationElement(parameters) {
              _classCallCheck(this, PopupAnnotationElement);

              var isRenderable = !!(
                parameters.data.title || parameters.data.contents
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(PopupAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable
                )
              );
            }
