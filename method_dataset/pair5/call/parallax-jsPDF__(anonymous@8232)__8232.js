function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    function o(e, t) {
      (this.platform = t || (i.isMac ? "mac" : "win")),
        (this.commands = {}),
        (this.commandKeyBinding = {}),
        this.addCommands(e),
        (this.$singleCommand = !0);
    }
    function u(e, t) {
      o.call(this, e, t), (this.$singleCommand = !1);
    }
    var r = e("../lib/keys"),
      i = e("../lib/useragent"),
      s = r.KEY_MODS;
    (u.prototype = o.prototype),
      function() {
        function e(e) {
          return (typeof e == "object" && e.bindKey && e.bindKey.position) || 0;
        }
        (this.addCommand = function(e) {
          this.commands[e.name] && this.removeCommand(e),
            (this.commands[e.name] = e),
            e.bindKey && this._buildKeyHash(e);
        }),
          (this.removeCommand = function(e, t) {
            var n = e && (typeof e == "string" ? e : e.name);
            (e = this.commands[n]), t || delete this.commands[n];
            var r = this.commandKeyBinding;
            for (var i in r) {
              var s = r[i];
              if (s == e) delete r[i];
              else if (Array.isArray(s)) {
                var o = s.indexOf(e);
                o != -1 && (s.splice(o, 1), s.length == 1 && (r[i] = s[0]));
              }
            }
          }),
          (this.bindKey = function(e, t, n) {
            typeof e == "object" &&
              e &&
              (n == undefined && (n = e.position), (e = e[this.platform]));
            if (!e) return;
            if (typeof t == "function")
              return this.addCommand({
                exec: t,
                bindKey: e,
                name: t.name || e
              });
            e.split("|").forEach(function(e) {
              var r = "";
              if (e.indexOf(" ") != -1) {
                var i = e.split(/\s+/);
                (e = i.pop()),
                  i.forEach(function(e) {
                    var t = this.parseKeys(e),
                      n = s[t.hashId] + t.key;
                    (r += (r ? " " : "") + n),
                      this._addCommandToBinding(r, "chainKeys");
                  }, this),
                  (r += " ");
              }
              var o = this.parseKeys(e),
                u = s[o.hashId] + o.key;
              this._addCommandToBinding(r + u, t, n);
            }, this);
          }),
          (this._addCommandToBinding = function(t, n, r) {
            var i = this.commandKeyBinding,
              s;
            if (!n) delete i[t];
            else if (!i[t] || this.$singleCommand) i[t] = n;
            else {
              Array.isArray(i[t])
                ? (s = i[t].indexOf(n)) != -1 && i[t].splice(s, 1)
                : (i[t] = [i[t]]),
                typeof r != "number" &&
                  (r || n.isDefault ? (r = -100) : (r = e(n)));
              var o = i[t];
              for (s = 0; s < o.length; s++) {
                var u = o[s],
                  a = e(u);
                if (a > r) break;
              }
              o.splice(s, 0, n);
            }
          }),
          (this.addCommands = function(e) {
            e &&
              Object.keys(e).forEach(function(t) {
                var n = e[t];
                if (!n) return;
                if (typeof n == "string") return this.bindKey(n, t);
                typeof n == "function" && (n = { exec: n });
                if (typeof n != "object") return;
                n.name || (n.name = t), this.addCommand(n);
              }, this);
          }),
          (this.removeCommands = function(e) {
            Object.keys(e).forEach(function(t) {
              this.removeCommand(e[t]);
            }, this);
          }),
          (this.bindKeys = function(e) {
            Object.keys(e).forEach(function(t) {
              this.bindKey(t, e[t]);
            }, this);
          }),
          (this._buildKeyHash = function(e) {
            this.bindKey(e.bindKey, e);
          }),
          (this.parseKeys = function(e) {
            var t = e
                .toLowerCase()
                .split(/[\-\+]([\-\+])?/)
                .filter(function(e) {
                  return e;
                }),
              n = t.pop(),
              i = r[n];
            if (r.FUNCTION_KEYS[i]) n = r.FUNCTION_KEYS[i].toLowerCase();
            else {
              if (!t.length) return { key: n, hashId: -1 };
              if (t.length == 1 && t[0] == "shift")
                return { key: n.toUpperCase(), hashId: -1 };
            }
            var s = 0;
            for (var o = t.length; o--; ) {
              var u = r.KEY_MODS[t[o]];
              if (u == null)
                return (
                  typeof console != "undefined" &&
                    console.error("invalid modifier " + t[o] + " in " + e),
                  !1
                );
              s |= u;
            }
            return { key: n, hashId: s };
          }),
          (this.findKeyCommand = function(t, n) {
            var r = s[t] + n;
            return this.commandKeyBinding[r];
          }),
          (this.handleKeyboard = function(e, t, n, r) {
            if (r < 0) return;
            var i = s[t] + n,
              o = this.commandKeyBinding[i];
            e.$keyChain &&
              ((e.$keyChain += " " + i),
              (o = this.commandKeyBinding[e.$keyChain] || o));
            if (o)
              if (o == "chainKeys" || o[o.length - 1] == "chainKeys")
                return (e.$keyChain = e.$keyChain || i), { command: "null" };
            if (e.$keyChain)
              if ((!!t && t != 4) || n.length != 1) {
                if (t == -1 || r > 0) e.$keyChain = "";
              } else e.$keyChain = e.$keyChain.slice(0, -i.length - 1);
            return { command: o };
          }),
          (this.getStatusText = function(e, t) {
            return t.$keyChain || "";
          });
      }.call(o.prototype),
      (t.HashHandler = o),
      (t.MultiHashHandler = u);
  }),

}
