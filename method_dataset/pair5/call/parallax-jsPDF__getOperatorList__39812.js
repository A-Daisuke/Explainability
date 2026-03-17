const __obj__ = {
                value: function getOperatorList(evaluator, task, renderForms) {
                  if (renderForms || this.appearance) {
                    return _get(
                      _getPrototypeOf(TextWidgetAnnotation.prototype),
                      "getOperatorList",
                      this
                    ).call(this, evaluator, task, renderForms);
                  }

                  var operatorList = new _operator_list.OperatorList();

                  if (!this.data.defaultAppearance) {
                    return Promise.resolve(operatorList);
                  }

                  var stream = new _stream.Stream(
                    (0, _util.stringToBytes)(this.data.defaultAppearance)
                  );
                  return evaluator
                    .getOperatorList({
                      stream: stream,
                      task: task,
                      resources: this.fieldResources,
                      operatorList: operatorList
                    })
                    .then(function() {
                      return operatorList;
                    });
                }

};
