function __method_wrapper__() {
    smarty: function(stream, state) {
      if (stream.match(settings.leftDelimiter, false)) {
        if (stream.match(regs.smartyComment, false)) {
          return helpers.chain(stream, state, parsers.inBlock("comment", "*" + settings.rightDelimiter));
        }
      } else if (stream.match(settings.rightDelimiter, false)) {
        stream.eat(settings.rightDelimiter);
        state.tokenize = parsers.html;
        state.localMode = htmlMixedMode;
        state.localState = state.htmlMixedState;
        return "tag";
      }

      return helpers.maybeBackup(stream, settings.rightDelimiter, smartyMode.token(stream, state.localState));
    },

}
