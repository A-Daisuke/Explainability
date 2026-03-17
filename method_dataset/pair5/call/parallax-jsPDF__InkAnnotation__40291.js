            function InkAnnotation(parameters) {
              var _this14;

              _classCallCheck(this, InkAnnotation);

              _this14 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(InkAnnotation).call(this, parameters)
              );
              _this14.data.annotationType = _util.AnnotationType.INK;
              var dict = parameters.dict;
              var xref = parameters.xref;
              var originalInkLists = dict.getArray("InkList");
              _this14.data.inkLists = [];

              for (var i = 0, ii = originalInkLists.length; i < ii; ++i) {
                _this14.data.inkLists.push([]);

                for (
                  var j = 0, jj = originalInkLists[i].length;
                  j < jj;
                  j += 2
                ) {
                  _this14.data.inkLists[i].push({
                    x: xref.fetchIfRef(originalInkLists[i][j]),
                    y: xref.fetchIfRef(originalInkLists[i][j + 1])
                  });
                }
              }

              _this14._preparePopup(dict);

              return _this14;
            }
