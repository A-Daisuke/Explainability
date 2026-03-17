            function FileAttachmentAnnotation(parameters) {
              var _this20;

              _classCallCheck(this, FileAttachmentAnnotation);

              _this20 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(FileAttachmentAnnotation).call(this, parameters)
              );
              var file = new _obj.FileSpec(
                parameters.dict.get("FS"),
                parameters.xref
              );
              _this20.data.annotationType = _util.AnnotationType.FILEATTACHMENT;
              _this20.data.file = file.serializable;

              _this20._preparePopup(parameters.dict);

              return _this20;
            }
