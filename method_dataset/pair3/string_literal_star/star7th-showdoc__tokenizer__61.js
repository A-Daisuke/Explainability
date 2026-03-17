const __obj__ = {
    tokenizer: function(stream, state) {
      if (stream.match(settings.leftDelimiter, true)) {
        if (stream.eat("*")) {
          return helpers.chain(stream, state, parsers.inBlock("comment", "*" + settings.rightDelimiter));
        } else {
          // Smarty 3 allows { and } surrounded by whitespace to NOT slip into Smarty mode
          state.depth++;
          var isEol = stream.eol();
          var isFollowedByWhitespace = /\s/.test(stream.peek());
          if (settings.smartyVersion === 3 && settings.leftDelimiter === "{" && (isEol || isFollowedByWhitespace)) {
            state.depth--;
            return null;
          } else {
            state.tokenize = parsers.smarty;
            last = "startTag";
            return "tag";
          }
        }
      } else {
        stream.next();
        return null;
      }
    },

};
