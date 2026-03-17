            function IdentityCMap(vertical, n) {
              var _this;

              _classCallCheck(this, IdentityCMap);

              _this = _possibleConstructorReturn(
                this,
                _getPrototypeOf(IdentityCMap).call(this)
              );
              _this.vertical = vertical;

              _this.addCodespaceRange(n, 0, 0xffff);

              return _this;
            }
