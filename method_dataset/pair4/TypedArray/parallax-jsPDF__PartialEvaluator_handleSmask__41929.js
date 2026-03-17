function __method_wrapper__() {
            handleSMask: function PartialEvaluator_handleSmask(
              smask,
              resources,
              operatorList,
              task,
              stateManager
            ) {
              var smaskContent = smask.get("G");
              var smaskOptions = {
                subtype: smask.get("S").name,
                backdrop: smask.get("BC")
              };
              var transferObj = smask.get("TR");

              if ((0, _function.isPDFFunction)(transferObj)) {
                var transferFn = this.pdfFunctionFactory.create(transferObj);
                var transferMap = new Uint8Array(256);
                var tmp = new Float32Array(1);

                for (var i = 0; i < 256; i++) {
                  tmp[0] = i / 255;
                  transferFn(tmp, 0, tmp, 0);
                  transferMap[i] = (tmp[0] * 255) | 0;
                }

                smaskOptions.transferMap = transferMap;
              }

              return this.buildFormXObject(
                resources,
                smaskContent,
                smaskOptions,
                operatorList,
                task,
                stateManager.state.clone()
              );
            },

}
