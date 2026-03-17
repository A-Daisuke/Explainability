function __method_wrapper__() {
            buildPath: function PartialEvaluator_buildPath(
              operatorList,
              fn,
              args
            ) {
              var lastIndex = operatorList.length - 1;

              if (!args) {
                args = [];
              }

              if (
                lastIndex < 0 ||
                operatorList.fnArray[lastIndex] !== _util.OPS.constructPath
              ) {
                operatorList.addOp(_util.OPS.constructPath, [[fn], args]);
              } else {
                var opArgs = operatorList.argsArray[lastIndex];
                opArgs[0].push(fn);
                Array.prototype.push.apply(opArgs[1], args);
              }
            },

}
