function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../lib/keys"),
      i = e("../lib/event"),
      s = function(e) {
        (this.$editor = e),
          (this.$data = { editor: e }),
          (this.$handlers = []),
          this.setDefaultHandler(e.commands);
      };
    (function() {
      (this.setDefaultHandler = function(e) {
        this.removeKeyboardHandler(this.$defaultHandler),
          (this.$defaultHandler = e),
          this.addKeyboardHandler(e, 0);
      }),
        (this.setKeyboardHandler = function(e) {
          var t = this.$handlers;
          if (t[t.length - 1] == e) return;
          while (t[t.length - 1] && t[t.length - 1] != this.$defaultHandler)
            this.removeKeyboardHandler(t[t.length - 1]);
          this.addKeyboardHandler(e, 1);
        }),
        (this.addKeyboardHandler = function(e, t) {
          if (!e) return;
          typeof e == "function" && !e.handleKeyboard && (e.handleKeyboard = e);
          var n = this.$handlers.indexOf(e);
          n != -1 && this.$handlers.splice(n, 1),
            t == undefined
              ? this.$handlers.push(e)
              : this.$handlers.splice(t, 0, e),
            n == -1 && e.attach && e.attach(this.$editor);
        }),
        (this.removeKeyboardHandler = function(e) {
          var t = this.$handlers.indexOf(e);
          return t == -1
            ? !1
            : (this.$handlers.splice(t, 1),
              e.detach && e.detach(this.$editor),
              !0);
        }),
        (this.getKeyboardHandler = function() {
          return this.$handlers[this.$handlers.length - 1];
        }),
        (this.getStatusText = function() {
          var e = this.$data,
            t = e.editor;
          return this.$handlers
            .map(function(n) {
              return (n.getStatusText && n.getStatusText(t, e)) || "";
            })
            .filter(Boolean)
            .join(" ");
        }),
        (this.$callKeyboardHandlers = function(e, t, n, r) {
          var s,
            o = !1,
            u = this.$editor.commands;
          for (var a = this.$handlers.length; a--; ) {
            s = this.$handlers[a].handleKeyboard(this.$data, e, t, n, r);
            if (!s || !s.command) continue;
            s.command == "null"
              ? (o = !0)
              : (o = u.exec(s.command, this.$editor, s.args, r)),
              o &&
                r &&
                e != -1 &&
                s.passEvent != 1 &&
                s.command.passEvent != 1 &&
                i.stopEvent(r);
            if (o) break;
          }
          return (
            !o &&
              e == -1 &&
              ((s = { command: "insertstring" }),
              (o = u.exec("insertstring", this.$editor, t))),
            o &&
              this.$editor._signal &&
              this.$editor._signal("keyboardActivity", s),
            o
          );
        }),
        (this.onCommandKey = function(e, t, n) {
          var i = r.keyCodeToString(n);
          this.$callKeyboardHandlers(t, i, n, e);
        }),
        (this.onTextInput = function(e) {
          this.$callKeyboardHandlers(-1, e);
        });
    }.call(s.prototype),
      (t.KeyBinding = s));
  }),

}
