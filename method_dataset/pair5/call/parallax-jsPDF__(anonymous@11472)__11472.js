function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      i = e("../lib/dom"),
      s = e("../lib/lang"),
      o = e("../lib/useragent"),
      u = e("../lib/event_emitter").EventEmitter,
      a = function(e) {
        (this.element = i.createElement("div")),
          (this.element.className = "ace_layer ace_text-layer"),
          e.appendChild(this.element),
          (this.$updateEolChar = this.$updateEolChar.bind(this));
      };
    (function() {
      r.implement(this, u),
        (this.EOF_CHAR = "\u00b6"),
        (this.EOL_CHAR_LF = "\u00ac"),
        (this.EOL_CHAR_CRLF = "\u00a4"),
        (this.EOL_CHAR = this.EOL_CHAR_LF),
        (this.TAB_CHAR = "\u2014"),
        (this.SPACE_CHAR = "\u00b7"),
        (this.$padding = 0),
        (this.$updateEolChar = function() {
          var e =
            this.session.doc.getNewLineCharacter() == "\n"
              ? this.EOL_CHAR_LF
              : this.EOL_CHAR_CRLF;
          if (this.EOL_CHAR != e) return (this.EOL_CHAR = e), !0;
        }),
        (this.setPadding = function(e) {
          (this.$padding = e), (this.element.style.padding = "0 " + e + "px");
        }),
        (this.getLineHeight = function() {
          return this.$fontMetrics.$characterSize.height || 0;
        }),
        (this.getCharacterWidth = function() {
          return this.$fontMetrics.$characterSize.width || 0;
        }),
        (this.$setFontMetrics = function(e) {
          (this.$fontMetrics = e),
            this.$fontMetrics.on(
              "changeCharacterSize",
              function(e) {
                this._signal("changeCharacterSize", e);
              }.bind(this)
            ),
            this.$pollSizeChanges();
        }),
        (this.checkForSizeChanges = function() {
          this.$fontMetrics.checkForSizeChanges();
        }),
        (this.$pollSizeChanges = function() {
          return (this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges());
        }),
        (this.setSession = function(e) {
          (this.session = e), e && this.$computeTabString();
        }),
        (this.showInvisibles = !1),
        (this.setShowInvisibles = function(e) {
          return this.showInvisibles == e
            ? !1
            : ((this.showInvisibles = e), this.$computeTabString(), !0);
        }),
        (this.displayIndentGuides = !0),
        (this.setDisplayIndentGuides = function(e) {
          return this.displayIndentGuides == e
            ? !1
            : ((this.displayIndentGuides = e), this.$computeTabString(), !0);
        }),
        (this.$tabStrings = []),
        (this.onChangeTabSize = this.$computeTabString = function() {
          var e = this.session.getTabSize();
          this.tabSize = e;
          var t = (this.$tabStrings = [0]);
          for (var n = 1; n < e + 1; n++)
            this.showInvisibles
              ? t.push(
                  "<span class='ace_invisible ace_invisible_tab'>" +
                    s.stringRepeat(this.TAB_CHAR, n) +
                    "</span>"
                )
              : t.push(s.stringRepeat(" ", n));
          if (this.displayIndentGuides) {
            this.$indentGuideRe = /\s\S| \t|\t |\s$/;
            var r = "ace_indent-guide",
              i = "",
              o = "";
            if (this.showInvisibles) {
              (r += " ace_invisible"),
                (i = " ace_invisible_space"),
                (o = " ace_invisible_tab");
              var u = s.stringRepeat(this.SPACE_CHAR, this.tabSize),
                a = s.stringRepeat(this.TAB_CHAR, this.tabSize);
            } else
              var u = s.stringRepeat(" ", this.tabSize),
                a = u;
            (this.$tabStrings[" "] =
              "<span class='" + r + i + "'>" + u + "</span>"),
              (this.$tabStrings["	"] =
                "<span class='" + r + o + "'>" + a + "</span>");
          }
        }),
        (this.updateLines = function(e, t, n) {
          (this.config.lastRow != e.lastRow ||
            this.config.firstRow != e.firstRow) &&
            this.scrollLines(e),
            (this.config = e);
          var r = Math.max(t, e.firstRow),
            i = Math.min(n, e.lastRow),
            s = this.element.childNodes,
            o = 0;
          for (var u = e.firstRow; u < r; u++) {
            var a = this.session.getFoldLine(u);
            if (a) {
              if (a.containsRow(r)) {
                r = a.start.row;
                break;
              }
              u = a.end.row;
            }
            o++;
          }
          var u = r,
            a = this.session.getNextFoldLine(u),
            f = a ? a.start.row : Infinity;
          for (;;) {
            u > f &&
              ((u = a.end.row + 1),
              (a = this.session.getNextFoldLine(u, a)),
              (f = a ? a.start.row : Infinity));
            if (u > i) break;
            var l = s[o++];
            if (l) {
              var c = [];
              this.$renderLine(c, u, !this.$useLineGroups(), u == f ? a : !1),
                (l.style.height =
                  e.lineHeight * this.session.getRowLength(u) + "px"),
                (l.innerHTML = c.join(""));
            }
            u++;
          }
        }),
        (this.scrollLines = function(e) {
          var t = this.config;
          this.config = e;
          if (!t || t.lastRow < e.firstRow) return this.update(e);
          if (e.lastRow < t.firstRow) return this.update(e);
          var n = this.element;
          if (t.firstRow < e.firstRow)
            for (
              var r = this.session.getFoldedRowCount(
                t.firstRow,
                e.firstRow - 1
              );
              r > 0;
              r--
            )
              n.removeChild(n.firstChild);
          if (t.lastRow > e.lastRow)
            for (
              var r = this.session.getFoldedRowCount(e.lastRow + 1, t.lastRow);
              r > 0;
              r--
            )
              n.removeChild(n.lastChild);
          if (e.firstRow < t.firstRow) {
            var i = this.$renderLinesFragment(e, e.firstRow, t.firstRow - 1);
            n.firstChild ? n.insertBefore(i, n.firstChild) : n.appendChild(i);
          }
          if (e.lastRow > t.lastRow) {
            var i = this.$renderLinesFragment(e, t.lastRow + 1, e.lastRow);
            n.appendChild(i);
          }
        }),
        (this.$renderLinesFragment = function(e, t, n) {
          var r = this.element.ownerDocument.createDocumentFragment(),
            s = t,
            o = this.session.getNextFoldLine(s),
            u = o ? o.start.row : Infinity;
          for (;;) {
            s > u &&
              ((s = o.end.row + 1),
              (o = this.session.getNextFoldLine(s, o)),
              (u = o ? o.start.row : Infinity));
            if (s > n) break;
            var a = i.createElement("div"),
              f = [];
            this.$renderLine(f, s, !1, s == u ? o : !1),
              (a.innerHTML = f.join(""));
            if (this.$useLineGroups())
              (a.className = "ace_line_group"),
                r.appendChild(a),
                (a.style.height =
                  e.lineHeight * this.session.getRowLength(s) + "px");
            else while (a.firstChild) r.appendChild(a.firstChild);
            s++;
          }
          return r;
        }),
        (this.update = function(e) {
          this.config = e;
          var t = [],
            n = e.firstRow,
            r = e.lastRow,
            i = n,
            s = this.session.getNextFoldLine(i),
            o = s ? s.start.row : Infinity;
          for (;;) {
            i > o &&
              ((i = s.end.row + 1),
              (s = this.session.getNextFoldLine(i, s)),
              (o = s ? s.start.row : Infinity));
            if (i > r) break;
            this.$useLineGroups() &&
              t.push(
                "<div class='ace_line_group' style='height:",
                e.lineHeight * this.session.getRowLength(i),
                "px'>"
              ),
              this.$renderLine(t, i, !1, i == o ? s : !1),
              this.$useLineGroups() && t.push("</div>"),
              i++;
          }
          this.element.innerHTML = t.join("");
        }),
        (this.$textToken = { text: !0, rparen: !0, lparen: !0 }),
        (this.$renderToken = function(e, t, n, r) {
          var i = this,
            o = /\t|&|<|>|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\u3000\uFEFF\uFFF9-\uFFFC])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]/g,
            u = function(e, n, r, o, u) {
              if (n)
                return i.showInvisibles
                  ? "<span class='ace_invisible ace_invisible_space'>" +
                      s.stringRepeat(i.SPACE_CHAR, e.length) +
                      "</span>"
                  : e;
              if (e == "&") return "&#38;";
              if (e == "<") return "&#60;";
              if (e == ">") return "&#62;";
              if (e == "	") {
                var a = i.session.getScreenTabSize(t + o);
                return (t += a - 1), i.$tabStrings[a];
              }
              if (e == "\u3000") {
                var f = i.showInvisibles
                    ? "ace_cjk ace_invisible ace_invisible_space"
                    : "ace_cjk",
                  l = i.showInvisibles ? i.SPACE_CHAR : "";
                return (
                  (t += 1),
                  "<span class='" +
                    f +
                    "' style='width:" +
                    i.config.characterWidth * 2 +
                    "px'>" +
                    l +
                    "</span>"
                );
              }
              return r
                ? "<span class='ace_invisible ace_invisible_space ace_invalid'>" +
                    i.SPACE_CHAR +
                    "</span>"
                : ((t += 1),
                  "<span class='ace_cjk' style='width:" +
                    i.config.characterWidth * 2 +
                    "px'>" +
                    e +
                    "</span>");
            },
            a = r.replace(o, u);
          if (!this.$textToken[n.type]) {
            var f = "ace_" + n.type.replace(/\./g, " ace_"),
              l = "";
            n.type == "fold" &&
              (l =
                " style='width:" +
                n.value.length * this.config.characterWidth +
                "px;' "),
              e.push("<span class='", f, "'", l, ">", a, "</span>");
          } else e.push(a);
          return t + r.length;
        }),
        (this.renderIndentGuide = function(e, t, n) {
          var r = t.search(this.$indentGuideRe);
          return r <= 0 || r >= n
            ? t
            : t[0] == " "
            ? ((r -= r % this.tabSize),
              e.push(s.stringRepeat(this.$tabStrings[" "], r / this.tabSize)),
              t.substr(r))
            : t[0] == "	"
            ? (e.push(s.stringRepeat(this.$tabStrings["	"], r)), t.substr(r))
            : t;
        }),
        (this.$renderWrappedLine = function(e, t, n, r) {
          var i = 0,
            o = 0,
            u = n[0],
            a = 0;
          for (var f = 0; f < t.length; f++) {
            var l = t[f],
              c = l.value;
            if (f == 0 && this.displayIndentGuides) {
              (i = c.length), (c = this.renderIndentGuide(e, c, u));
              if (!c) continue;
              i -= c.length;
            }
            if (i + c.length < u)
              (a = this.$renderToken(e, a, l, c)), (i += c.length);
            else {
              while (i + c.length >= u)
                (a = this.$renderToken(e, a, l, c.substring(0, u - i))),
                  (c = c.substring(u - i)),
                  (i = u),
                  r ||
                    e.push(
                      "</div>",
                      "<div class='ace_line' style='height:",
                      this.config.lineHeight,
                      "px'>"
                    ),
                  e.push(s.stringRepeat("\u00a0", n.indent)),
                  o++,
                  (a = 0),
                  (u = n[o] || Number.MAX_VALUE);
              c.length != 0 &&
                ((i += c.length), (a = this.$renderToken(e, a, l, c)));
            }
          }
        }),
        (this.$renderSimpleLine = function(e, t) {
          var n = 0,
            r = t[0],
            i = r.value;
          this.displayIndentGuides && (i = this.renderIndentGuide(e, i)),
            i && (n = this.$renderToken(e, n, r, i));
          for (var s = 1; s < t.length; s++)
            (r = t[s]), (i = r.value), (n = this.$renderToken(e, n, r, i));
        }),
        (this.$renderLine = function(e, t, n, r) {
          !r && r != 0 && (r = this.session.getFoldLine(t));
          if (r) var i = this.$getFoldLineTokens(t, r);
          else var i = this.session.getTokens(t);
          n ||
            e.push(
              "<div class='ace_line' style='height:",
              this.config.lineHeight *
                (this.$useLineGroups() ? 1 : this.session.getRowLength(t)),
              "px'>"
            );
          if (i.length) {
            var s = this.session.getRowSplitData(t);
            s && s.length
              ? this.$renderWrappedLine(e, i, s, n)
              : this.$renderSimpleLine(e, i);
          }
          this.showInvisibles &&
            (r && (t = r.end.row),
            e.push(
              "<span class='ace_invisible ace_invisible_eol'>",
              t == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR,
              "</span>"
            )),
            n || e.push("</div>");
        }),
        (this.$getFoldLineTokens = function(e, t) {
          function i(e, t, n) {
            var i = 0,
              s = 0;
            while (s + e[i].value.length < t) {
              (s += e[i].value.length), i++;
              if (i == e.length) return;
            }
            if (s != t) {
              var o = e[i].value.substring(t - s);
              o.length > n - t && (o = o.substring(0, n - t)),
                r.push({ type: e[i].type, value: o }),
                (s = t + o.length),
                (i += 1);
            }
            while (s < n && i < e.length) {
              var o = e[i].value;
              o.length + s > n
                ? r.push({ type: e[i].type, value: o.substring(0, n - s) })
                : r.push(e[i]),
                (s += o.length),
                (i += 1);
            }
          }
          var n = this.session,
            r = [],
            s = n.getTokens(e);
          return (
            t.walk(
              function(e, t, o, u, a) {
                e != null
                  ? r.push({ type: "fold", value: e })
                  : (a && (s = n.getTokens(t)), s.length && i(s, u, o));
              },
              t.end.row,
              this.session.getLine(t.end.row).length
            ),
            r
          );
        }),
        (this.$useLineGroups = function() {
          return this.session.getUseWrapMode();
        }),
        (this.destroy = function() {
          clearInterval(this.$pollSizeChangesTimer),
            this.$measureNode &&
              this.$measureNode.parentNode.removeChild(this.$measureNode),
            delete this.$measureNode;
        });
    }.call(a.prototype),
      (t.Text = a));
  }),

}
