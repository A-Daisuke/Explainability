          function PDFSinglePageViewer(options) {
            var _this;

            _classCallCheck(this, PDFSinglePageViewer);

            _this = _possibleConstructorReturn(
              this,
              _getPrototypeOf(PDFSinglePageViewer).call(this, options)
            );

            _this.eventBus.on("pagesinit", function(evt) {
              _this._ensurePageViewVisible();
            });

            return _this;
          }
