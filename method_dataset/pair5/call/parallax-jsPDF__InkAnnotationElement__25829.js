            function InkAnnotationElement(parameters) {
              var _this5;

              _classCallCheck(this, InkAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              _this5 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(InkAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
              _this5.containerClassName = "inkAnnotation";
              _this5.svgElementName = "svg:polyline";
              return _this5;
            }
