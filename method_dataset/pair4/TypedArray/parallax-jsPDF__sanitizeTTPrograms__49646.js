              function sanitizeTTPrograms(fpgm, prep, cvt, maxFunctionDefs) {
                var ttContext = {
                  functionsDefined: [],
                  functionsUsed: [],
                  functionsStackDeltas: [],
                  tooComplexToFollowFunctions: false,
                  hintsValid: true
                };

                if (fpgm) {
                  sanitizeTTProgram(fpgm, ttContext);
                }

                if (prep) {
                  sanitizeTTProgram(prep, ttContext);
                }

                if (fpgm) {
                  checkInvalidFunctions(ttContext, maxFunctionDefs);
                }

                if (cvt && cvt.length & 1) {
                  var cvtData = new Uint8Array(cvt.length + 1);
                  cvtData.set(cvt.data);
                  cvt.data = cvtData;
                }

                return ttContext.hintsValid;
              }
