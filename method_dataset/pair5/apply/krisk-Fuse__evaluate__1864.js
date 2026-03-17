      var evaluate = function evaluate(node, item, idx) {
        if (!node.children) {
          var keyId = node.keyId,
            searcher = node.searcher;
          var matches = _this._findMatches({
            key: _this._keyStore.get(keyId),
            value: _this._myIndex.getValueForItemAtKeyId(item, keyId),
            searcher: searcher
          });
          if (matches && matches.length) {
            return [{
              idx: idx,
              item: item,
              matches: matches
            }];
          }
          return [];
        }
        var res = [];
        for (var i = 0, len = node.children.length; i < len; i += 1) {
          var child = node.children[i];
          var result = evaluate(child, item, idx);
          if (result.length) {
            res.push.apply(res, _toConsumableArray(result));
          } else if (node.operator === LogicalOperator.AND) {
            return [];
          }
        }
        return res;
      };
