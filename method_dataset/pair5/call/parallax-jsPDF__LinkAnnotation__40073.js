            function LinkAnnotation(params) {
              var _this7;

              _classCallCheck(this, LinkAnnotation);

              _this7 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(LinkAnnotation).call(this, params)
              );
              _this7.data.annotationType = _util.AnnotationType.LINK;

              _obj.Catalog.parseDestDictionary({
                destDict: params.dict,
                resultObj: _this7.data,
                docBaseUrl: params.pdfManager.docBaseUrl
              });

              return _this7;
            }
