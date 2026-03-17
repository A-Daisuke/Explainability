            function PolylineAnnotationElement(parameters) {
              var _this3;

              _classCallCheck(this, PolylineAnnotationElement);

              var isRenderable = !!(
                parameters.data.hasPopup ||
                parameters.data.title ||
                parameters.data.contents
              );
              _this3 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PolylineAnnotationElement).call(
                  this,
                  parameters,
                  isRenderable,
                  true
                )
              );
              _this3.containerClassName = "polylineAnnotation";
              _this3.svgElementName = "svg:polyline";
              return _this3;
            }
