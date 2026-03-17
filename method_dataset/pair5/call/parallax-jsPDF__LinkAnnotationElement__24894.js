            function LinkAnnotationElement(parameters) {
              _classCallCheck(this, LinkAnnotationElement);

              var isRenderable = !!(
                parameters.data.url ||
                parameters.data.dest ||
                parameters.data.action
              );
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(LinkAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable
                )
              );
            }
