function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./config"),
      i = 2e3,
      s = function(e) {
        (this.states = e), (this.regExps = {}), (this.matchMappings = {});
        for (var t in this.states) {
          var n = this.states[t],
            r = [],
            i = 0,
            s = (this.matchMappings[t] = { defaultToken: "text" }),
            o = "g",
            u = [];
          for (var a = 0; a < n.length; a++) {
            var f = n[a];
            f.defaultToken && (s.defaultToken = f.defaultToken),
              f.caseInsensitive && (o = "gi");
            if (f.regex == null) continue;
            f.regex instanceof RegExp &&
              (f.regex = f.regex.toString().slice(1, -1));
            var l = f.regex,
              c = new RegExp("(?:(" + l + ")|(.))").exec("a").length - 2;
            Array.isArray(f.token)
              ? f.token.length == 1 || c == 1
                ? (f.token = f.token[0])
                : c - 1 != f.token.length
                ? (this.reportError(
                    "number of classes and regexp groups doesn't match",
                    { rule: f, groupCount: c - 1 }
                  ),
                  (f.token = f.token[0]))
                : ((f.tokenArray = f.token),
                  (f.token = null),
                  (f.onMatch = this.$arrayTokens))
              : typeof f.token == "function" &&
                !f.onMatch &&
                (c > 1
                  ? (f.onMatch = this.$applyToken)
                  : (f.onMatch = f.token)),
              c > 1 &&
                (/\\\d/.test(f.regex)
                  ? (l = f.regex.replace(/\\([0-9]+)/g, function(e, t) {
                      return "\\" + (parseInt(t, 10) + i + 1);
                    }))
                  : ((c = 1), (l = this.removeCapturingGroups(f.regex))),
                !f.splitRegex && typeof f.token != "string" && u.push(f)),
              (s[i] = a),
              (i += c),
              r.push(l),
              f.onMatch || (f.onMatch = null);
          }
          r.length || ((s[0] = 0), r.push("$")),
            u.forEach(function(e) {
              e.splitRegex = this.createSplitterRegexp(e.regex, o);
            }, this),
            (this.regExps[t] = new RegExp("(" + r.join(")|(") + ")|($)", o));
        }
      };
    (function() {
      (this.$setMaxTokenCount = function(e) {
        i = e | 0;
      }),
        (this.$applyToken = function(e) {
          var t = this.splitRegex.exec(e).slice(1),
            n = this.token.apply(this, t);
          if (typeof n == "string") return [{ type: n, value: e }];
          var r = [];
          for (var i = 0, s = n.length; i < s; i++)
            t[i] && (r[r.length] = { type: n[i], value: t[i] });
          return r;
        }),
        (this.$arrayTokens = function(e) {
          if (!e) return [];
          var t = this.splitRegex.exec(e);
          if (!t) return "text";
          var n = [],
            r = this.tokenArray;
          for (var i = 0, s = r.length; i < s; i++)
            t[i + 1] && (n[n.length] = { type: r[i], value: t[i + 1] });
          return n;
        }),
        (this.removeCapturingGroups = function(e) {
          var t = e.replace(/\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g, function(
            e,
            t
          ) {
            return t ? "(?:" : e;
          });
          return t;
        }),
        (this.createSplitterRegexp = function(e, t) {
          if (e.indexOf("(?=") != -1) {
            var n = 0,
              r = !1,
              i = {};
            e.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(
              e,
              t,
              s,
              o,
              u,
              a
            ) {
              return (
                r
                  ? (r = u != "]")
                  : u
                  ? (r = !0)
                  : o
                  ? (n == i.stack && ((i.end = a + 1), (i.stack = -1)), n--)
                  : s && (n++, s.length != 1 && ((i.stack = n), (i.start = a))),
                e
              );
            }),
              i.end != null &&
                /^\)*$/.test(e.substr(i.end)) &&
                (e = e.substring(0, i.start) + e.substr(i.end));
          }
          return (
            e.charAt(0) != "^" && (e = "^" + e),
            e.charAt(e.length - 1) != "$" && (e += "$"),
            new RegExp(e, (t || "").replace("g", ""))
          );
        }),
        (this.getLineTokens = function(e, t) {
          if (t && typeof t != "string") {
            var n = t.slice(0);
            (t = n[0]), t === "#tmp" && (n.shift(), (t = n.shift()));
          } else var n = [];
          var r = t || "start",
            s = this.states[r];
          s || ((r = "start"), (s = this.states[r]));
          var o = this.matchMappings[r],
            u = this.regExps[r];
          u.lastIndex = 0;
          var a,
            f = [],
            l = 0,
            c = 0,
            h = { type: null, value: "" };
          while ((a = u.exec(e))) {
            var p = o.defaultToken,
              d = null,
              v = a[0],
              m = u.lastIndex;
            if (m - v.length > l) {
              var g = e.substring(l, m - v.length);
              h.type == p
                ? (h.value += g)
                : (h.type && f.push(h), (h = { type: p, value: g }));
            }
            for (var y = 0; y < a.length - 2; y++) {
              if (a[y + 1] === undefined) continue;
              (d = s[o[y]]),
                d.onMatch ? (p = d.onMatch(v, r, n)) : (p = d.token),
                d.next &&
                  (typeof d.next == "string"
                    ? (r = d.next)
                    : (r = d.next(r, n)),
                  (s = this.states[r]),
                  s ||
                    (this.reportError("state doesn't exist", r),
                    (r = "start"),
                    (s = this.states[r])),
                  (o = this.matchMappings[r]),
                  (l = m),
                  (u = this.regExps[r]),
                  (u.lastIndex = m));
              break;
            }
            if (v)
              if (typeof p == "string")
                (!!d && d.merge === !1) || h.type !== p
                  ? (h.type && f.push(h), (h = { type: p, value: v }))
                  : (h.value += v);
              else if (p) {
                h.type && f.push(h), (h = { type: null, value: "" });
                for (var y = 0; y < p.length; y++) f.push(p[y]);
              }
            if (l == e.length) break;
            l = m;
            if (c++ > i) {
              c > 2 * e.length &&
                this.reportError("infinite loop with in ace tokenizer", {
                  startState: t,
                  line: e
                });
              while (l < e.length)
                h.type && f.push(h),
                  (h = { value: e.substring(l, (l += 2e3)), type: "overflow" });
              (r = "start"), (n = []);
              break;
            }
          }
          return (
            h.type && f.push(h),
            n.length > 1 && n[0] !== r && n.unshift("#tmp", r),
            { tokens: f, state: n.length ? n : r }
          );
        }),
        (this.reportError = r.reportError);
    }.call(s.prototype),
      (t.Tokenizer = s));
  }),

}
