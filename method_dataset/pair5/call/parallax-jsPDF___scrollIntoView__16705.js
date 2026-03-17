function __method_wrapper__() {
              value: function _scrollIntoView(_ref) {
                var _this2 = this;

                var pageDiv = _ref.pageDiv,
                  _ref$pageSpot = _ref.pageSpot,
                  pageSpot = _ref$pageSpot === void 0 ? null : _ref$pageSpot,
                  _ref$pageNumber = _ref.pageNumber,
                  pageNumber =
                    _ref$pageNumber === void 0 ? null : _ref$pageNumber;

                if (pageNumber) {
                  this._setCurrentPageNumber(pageNumber);
                }

                var scrolledDown =
                  this._currentPageNumber >= this._previousPageNumber;

                this._ensurePageViewVisible();

                this.update();

                _get(
                  _getPrototypeOf(PDFSinglePageViewer.prototype),
                  "_scrollIntoView",
                  this
                ).call(this, {
                  pageDiv: pageDiv,
                  pageSpot: pageSpot,
                  pageNumber: pageNumber
                });

                this._updateScrollDown = function() {
                  _this2.scroll.down = scrolledDown;
                  _this2._updateScrollDown = null;
                };
              }

}
