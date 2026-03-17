            function FileAttachmentAnnotationElement(parameters) {
              var _this6;

              _classCallCheck(this, FileAttachmentAnnotationElement);

              _this6 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(FileAttachmentAnnotationElement).call(
                  this,
                  parameters,
                  true
                )
              );
              var _this6$data$file = _this6.data.file,
                filename = _this6$data$file.filename,
                content = _this6$data$file.content;
              _this6.filename = (0, _display_utils.getFilenameFromUrl)(
                filename
              );
              _this6.content = content;

              if (_this6.linkService.eventBus) {
                _this6.linkService.eventBus.dispatch(
                  "fileattachmentannotation",
                  {
                    source: _assertThisInitialized(_this6),
                    id: (0, _util.stringToPDFString)(filename),
                    filename: filename,
                    content: content
                  }
                );
              }

              return _this6;
            }
