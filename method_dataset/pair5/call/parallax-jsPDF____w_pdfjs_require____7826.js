            function __w_pdfjs_require__(moduleId) {
              if (installedModules[moduleId])
                return installedModules[moduleId].exports;
              var module = (installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
              });
              modules[moduleId].call(
                module.exports,
                module,
                module.exports,
                __w_pdfjs_require__
              );
              module.l = true;
              return module.exports;
            }
