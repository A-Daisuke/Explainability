function __method_wrapper__() {
            executeOperatorList: function CanvasGraphics_executeOperatorList(
              operatorList,
              executionStartIdx,
              continueCallback,
              stepper
            ) {
              var argsArray = operatorList.argsArray;
              var fnArray = operatorList.fnArray;
              var i = executionStartIdx || 0;
              var argsArrayLen = argsArray.length;

              if (argsArrayLen === i) {
                return i;
              }

              var chunkOperations =
                argsArrayLen - i > EXECUTION_STEPS &&
                typeof continueCallback === "function";
              var endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
              var steps = 0;
              var commonObjs = this.commonObjs;
              var objs = this.objs;
              var fnId;

              while (true) {
                if (stepper !== undefined && i === stepper.nextBreakPoint) {
                  stepper.breakIt(i, continueCallback);
                  return i;
                }

                fnId = fnArray[i];

                if (fnId !== _util.OPS.dependency) {
                  this[fnId].apply(this, argsArray[i]);
                } else {
                  var deps = argsArray[i];

                  for (var n = 0, nn = deps.length; n < nn; n++) {
                    var depObjId = deps[n];
                    var common = depObjId[0] === "g" && depObjId[1] === "_";
                    var objsPool = common ? commonObjs : objs;

                    if (!objsPool.has(depObjId)) {
                      objsPool.get(depObjId, continueCallback);
                      return i;
                    }
                  }
                }

                i++;

                if (i === argsArrayLen) {
                  return i;
                }

                if (chunkOperations && ++steps > EXECUTION_STEPS) {
                  if (Date.now() > endTime) {
                    continueCallback();
                    return i;
                  }

                  steps = 0;
                }
              }
            },

}
