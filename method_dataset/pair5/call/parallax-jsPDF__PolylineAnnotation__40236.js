            function PolylineAnnotation(parameters) {
              var _this12;

              _classCallCheck(this, PolylineAnnotation);

              _this12 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PolylineAnnotation).call(this, parameters)
              );
              _this12.data.annotationType = _util.AnnotationType.POLYLINE;
              var dict = parameters.dict;
              var rawVertices = dict.getArray("Vertices");
              _this12.data.vertices = [];

              for (var i = 0, ii = rawVertices.length; i < ii; i += 2) {
                _this12.data.vertices.push({
                  x: rawVertices[i],
                  y: rawVertices[i + 1]
                });
              }

              _this12._preparePopup(dict);

              return _this12;
            }
