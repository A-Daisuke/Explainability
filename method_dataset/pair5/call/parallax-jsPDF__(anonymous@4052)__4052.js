function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../lib/lang"),
      i = function() {
        this.$rules = {
          start: [
            { token: "empty_line", regex: "^$" },
            { defaultToken: "text" }
          ]
        };
      };
    (function() {
      (this.addRules = function(e, t) {
        if (!t) {
          for (var n in e) this.$rules[n] = e[n];
          return;
        }
        for (var n in e) {
          var r = e[n];
          for (var i = 0; i < r.length; i++) {
            var s = r[i];
            if (s.next || s.onMatch)
              typeof s.next == "string" &&
                s.next.indexOf(t) !== 0 &&
                (s.next = t + s.next),
                s.nextState &&
                  s.nextState.indexOf(t) !== 0 &&
                  (s.nextState = t + s.nextState);
          }
          this.$rules[t + n] = r;
        }
      }),
        (this.getRules = function() {
          return this.$rules;
        }),
        (this.embedRules = function(e, t, n, i, s) {
          var o = typeof e == "function" ? new e().getRules() : e;
          if (i) for (var u = 0; u < i.length; u++) i[u] = t + i[u];
          else {
            i = [];
            for (var a in o) i.push(t + a);
          }
          this.addRules(o, t);
          if (n) {
            var f = Array.prototype[s ? "push" : "unshift"];
            for (var u = 0; u < i.length; u++)
              f.apply(this.$rules[i[u]], r.deepCopy(n));
          }
          this.$embeds || (this.$embeds = []), this.$embeds.push(t);
        }),
        (this.getEmbeds = function() {
          return this.$embeds;
        });
      var e = function(e, t) {
          return (
            (e != "start" || t.length) && t.unshift(this.nextState, e),
            this.nextState
          );
        },
        t = function(e, t) {
          return t.shift(), t.shift() || "start";
        };
      (this.normalizeRules = function() {
        function i(s) {
          var o = r[s];
          o.processed = !0;
          for (var u = 0; u < o.length; u++) {
            var a = o[u],
              f = null;
            Array.isArray(a) && ((f = a), (a = {})),
              !a.regex &&
                a.start &&
                ((a.regex = a.start),
                a.next || (a.next = []),
                a.next.push(
                  { defaultToken: a.token },
                  {
                    token: a.token + ".end",
                    regex: a.end || a.start,
                    next: "pop"
                  }
                ),
                (a.token = a.token + ".start"),
                (a.push = !0));
            var l = a.next || a.push;
            if (l && Array.isArray(l)) {
              var c = a.stateName;
              c ||
                ((c = a.token),
                typeof c != "string" && (c = c[0] || ""),
                r[c] && (c += n++)),
                (r[c] = l),
                (a.next = c),
                i(c);
            } else l == "pop" && (a.next = t);
            a.push &&
              ((a.nextState = a.next || a.push), (a.next = e), delete a.push);
            if (a.rules)
              for (var h in a.rules)
                r[h]
                  ? r[h].push && r[h].push.apply(r[h], a.rules[h])
                  : (r[h] = a.rules[h]);
            var p =
              typeof a == "string"
                ? a
                : typeof a.include == "string"
                ? a.include
                : "";
            p && (f = r[p]);
            if (f) {
              var d = [u, 1].concat(f);
              a.noEscape &&
                (d = d.filter(function(e) {
                  return !e.next;
                })),
                o.splice.apply(o, d),
                u--;
            }
            a.keywordMap &&
              ((a.token = this.createKeywordMapper(
                a.keywordMap,
                a.defaultToken || "text",
                a.caseInsensitive
              )),
              delete a.defaultToken);
          }
        }
        var n = 0,
          r = this.$rules;
        Object.keys(r).forEach(i, this);
      }),
        (this.createKeywordMapper = function(e, t, n, r) {
          var i = Object.create(null);
          return (
            Object.keys(e).forEach(function(t) {
              var s = e[t];
              n && (s = s.toLowerCase());
              var o = s.split(r || "|");
              for (var u = o.length; u--; ) i[o[u]] = t;
            }),
            Object.getPrototypeOf(i) && (i.__proto__ = null),
            (this.$keywordList = Object.keys(i)),
            (e = null),
            n
              ? function(e) {
                  return i[e.toLowerCase()] || t;
                }
              : function(e) {
                  return i[e] || t;
                }
          );
        }),
        (this.getKeywords = function() {
          return this.$keywords;
        });
    }.call(i.prototype),
      (t.TextHighlightRules = i));
  }),

}
