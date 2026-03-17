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
