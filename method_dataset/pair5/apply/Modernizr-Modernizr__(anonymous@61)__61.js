function __method_wrapper__() {
        return function() {

          var elm = typeof document.createElement !== 'function' ?
            document.createElement(arguments[0]) :
            document.createElement.apply(document, arguments);

          // logic added to get simulate old firefox's behavior
          if (!called) {
            try {
              delete elm.onclick;
            } catch (e) {}

            elm.setAttribute = undefined;
            called = true;
          }
          return elm;
        };

}
