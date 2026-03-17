function __method_wrapper__() {
      token: function(stream, state) {
        if (stream.sol()) {
          state.indented = stream.indentation();
          state.startOfLine = true;
          state.tokenize = state.line;
          while (state.stack && state.stack.indented > state.indented && state.last != "slimSubmode") {
            state.line = state.tokenize = state.stack.tokenize;
            state.stack = state.stack.parent;
            state.subMode = null;
            state.subState = null;
          }
        }
        if (stream.eatSpace()) return null;
        var style = state.tokenize(stream, state);
        state.startOfLine = false;
        if (style) state.last = style;
        return styleMap.hasOwnProperty(style) ? styleMap[style] : style;
      },

}
