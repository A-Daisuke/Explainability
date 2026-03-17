const __obj__ = {
              value: function _scrollIntoView(_ref) {
                var pageDiv = _ref.pageDiv,
                  _ref$pageSpot = _ref.pageSpot,
                  pageSpot = _ref$pageSpot === void 0 ? null : _ref$pageSpot,
                  _ref$pageNumber = _ref.pageNumber,
                  pageNumber =
                    _ref$pageNumber === void 0 ? null : _ref$pageNumber;

                if (!pageSpot && !this.isInPresentationMode) {
                  var left = pageDiv.offsetLeft + pageDiv.clientLeft;
                  var right = left + pageDiv.clientWidth;
                  var _this$container = this.container,
                    scrollLeft = _this$container.scrollLeft,
                    clientWidth = _this$container.clientWidth;

                  if (
                    this._isScrollModeHorizontal ||
                    left < scrollLeft ||
                    right > scrollLeft + clientWidth
                  ) {
                    pageSpot = {
                      left: 0,
                      top: 0
                    };
                  }
                }

                _get(
                  _getPrototypeOf(PDFViewer.prototype),
                  "_scrollIntoView",
                  this
                ).call(this, {
                  pageDiv: pageDiv,
                  pageSpot: pageSpot,
                  pageNumber: pageNumber
                });
              }

};
