            function TextWidgetAnnotationElement(parameters) {
              _classCallCheck(this, TextWidgetAnnotationElement);

              var isRenderable =
                parameters.renderInteractiveForms ||
                (!parameters.data.hasAppearance &&
                  !!parameters.data.fieldValue);
              return _possibleConstructorReturn(
                this,
                _getPrototypeOf(TextWidgetAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable
                )
              );
            }
