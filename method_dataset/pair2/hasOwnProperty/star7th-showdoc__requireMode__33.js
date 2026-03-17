function __method_wrapper__() {
  CodeMirror.requireMode = function(mode, cont) {
    if (typeof mode != "string") mode = mode.name;
    if (CodeMirror.modes.hasOwnProperty(mode)) return ensureDeps(mode, cont);
    if (loading.hasOwnProperty(mode)) return loading[mode].push(cont);

    var file = CodeMirror.modeURL.replace(/%N/g, mode);
    if (env == "plain") {
      var script = document.createElement("script");
      script.src = file;
      var others = document.getElementsByTagName("script")[0];
      var list = loading[mode] = [cont];
      CodeMirror.on(script, "load", function() {
        ensureDeps(mode, function() {
          for (var i = 0; i < list.length; ++i) list[i]();
        });
      });
      others.parentNode.insertBefore(script, others);
    } else if (env == "cjs") {
      require(file);
      cont();
    } else if (env == "amd") {
      requirejs([file], cont);
    }
  };

}
