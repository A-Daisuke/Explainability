function __method_wrapper__() {
      tokenBase: function(stream, state) {
        var vxIndent = 0, style = false;
        var svxisOperatorChar = /[\[\]=:]/;
        var svxkpScopePrefixs = {
          "**":"variable-2", "*":"variable-2", "$$":"variable", "$":"variable",
          "^^":"attribute", "^":"attribute"};
        var ch = stream.peek();
        var vxCurCtlFlowCharValueAtStart = state.svxCurCtlFlowChar;
        if (state.vxCodeActive == true) {
          if (/[\[\]{}\(\);\:]/.test(ch)) {
            // bypass nesting and 1 char punc
            style = "meta";
            stream.next();
          } else if (ch == "/") {
            stream.next();
            if (stream.eat("/")) {
              stream.skipToEnd();
              style = "comment";
              state.svxCurCtlFlowChar = "S";
            } else {
              stream.backUp(1);
            }
          } else if (ch == "@") {
            // pipeline stage
            style = svxchScopePrefixes[ch];
            state.svxCurCtlFlowChar = "@";
            stream.next();
            stream.eatWhile(/[\w\$_]/);
          } else if (stream.match(/\b[mM]4+/, true)) { // match: function(pattern, consume, caseInsensitive)
            // m4 pre proc
            stream.skipTo("(");
            style = "def";
            state.svxCurCtlFlowChar = "M";
          } else if (ch == "!" && stream.sol()) {
            // v stmt in svx region
            // state.svxCurCtlFlowChar  = "S";
            style = "comment";
            stream.next();
          } else if (svxisOperatorChar.test(ch)) {
            // operators
            stream.eatWhile(svxisOperatorChar);
            style = "operator";
          } else if (ch == "#") {
            // phy hier
            state.svxCurCtlFlowChar  = (state.svxCurCtlFlowChar == "")
              ? ch : state.svxCurCtlFlowChar;
            stream.next();
            stream.eatWhile(/[+-]\d/);
            style = "tag";
          } else if (svxkpScopePrefixs.propertyIsEnumerable(ch)) {
            // special SVX operators
            style = svxkpScopePrefixs[ch];
            state.svxCurCtlFlowChar = state.svxCurCtlFlowChar == "" ? "S" : state.svxCurCtlFlowChar;  // stmt
            stream.next();
            stream.match(/[a-zA-Z_0-9]+/);
          } else if (style = svxchScopePrefixes[ch] || false) {
            // special SVX operators
            state.svxCurCtlFlowChar = state.svxCurCtlFlowChar == "" ? ch : state.svxCurCtlFlowChar;
            stream.next();
            stream.match(/[a-zA-Z_0-9]+/);
          }
          if (state.svxCurCtlFlowChar != vxCurCtlFlowCharValueAtStart) { // flow change
            vxIndent = svxGenIndent(stream, state);
            state.vxIndentRq = vxIndent;
          }
        }
        return style;
      },

}
