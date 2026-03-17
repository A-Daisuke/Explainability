  var bidiEngineFunction = function(args) {
    var text = args.text;
    args.x;
    args.y;
    var options = args.options || {};
    args.mutex || {};
    options.lang;
    var tmpText = [];

    options.isInputVisual =
      typeof options.isInputVisual === "boolean" ? options.isInputVisual : true;
    bidiEngine.setOptions(options);

    if (Object.prototype.toString.call(text) === "[object Array]") {
      var i = 0;
      tmpText = [];
      for (i = 0; i < text.length; i += 1) {
        if (Object.prototype.toString.call(text[i]) === "[object Array]") {
          tmpText.push([
            bidiEngine.doBidiReorder(text[i][0]),
            text[i][1],
            text[i][2]
          ]);
        } else {
          tmpText.push([bidiEngine.doBidiReorder(text[i])]);
        }
      }
      args.text = tmpText;
    } else {
      args.text = bidiEngine.doBidiReorder(text);
    }
    bidiEngine.setOptions({ isInputVisual: true });
  };
