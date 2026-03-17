function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      i = e("./lib/lang"),
      s = e("./config"),
      o = e("./lib/event_emitter").EventEmitter,
      u = e("./selection").Selection,
      a = e("./mode/text").Mode,
      f = e("./range").Range,
      l = e("./document").Document,
      c = e("./background_tokenizer").BackgroundTokenizer,
      h = e("./search_highlight").SearchHighlight,
      p = function(e, t) {
        (this.$breakpoints = []),
          (this.$decorations = []),
          (this.$frontMarkers = {}),
          (this.$backMarkers = {}),
          (this.$markerId = 1),
          (this.$undoSelect = !0),
          (this.$foldData = []),
          (this.id = "session" + ++p.$uid),
          (this.$foldData.toString = function() {
            return this.join("\n");
          }),
          this.on("changeFold", this.onChangeFold.bind(this)),
          (this.$onChange = this.onChange.bind(this));
        if (typeof e != "object" || !e.getLine) e = new l(e);
        this.setDocument(e),
          (this.selection = new u(this)),
          s.resetOptions(this),
          this.setMode(t),
          s._signal("session", this);
      };
    (function() {
      function m(e) {
        return e < 4352
          ? !1
          : (e >= 4352 && e <= 4447) ||
              (e >= 4515 && e <= 4519) ||
              (e >= 4602 && e <= 4607) ||
              (e >= 9001 && e <= 9002) ||
              (e >= 11904 && e <= 11929) ||
              (e >= 11931 && e <= 12019) ||
              (e >= 12032 && e <= 12245) ||
              (e >= 12272 && e <= 12283) ||
              (e >= 12288 && e <= 12350) ||
              (e >= 12353 && e <= 12438) ||
              (e >= 12441 && e <= 12543) ||
              (e >= 12549 && e <= 12589) ||
              (e >= 12593 && e <= 12686) ||
              (e >= 12688 && e <= 12730) ||
              (e >= 12736 && e <= 12771) ||
              (e >= 12784 && e <= 12830) ||
              (e >= 12832 && e <= 12871) ||
              (e >= 12880 && e <= 13054) ||
              (e >= 13056 && e <= 19903) ||
              (e >= 19968 && e <= 42124) ||
              (e >= 42128 && e <= 42182) ||
              (e >= 43360 && e <= 43388) ||
              (e >= 44032 && e <= 55203) ||
              (e >= 55216 && e <= 55238) ||
              (e >= 55243 && e <= 55291) ||
              (e >= 63744 && e <= 64255) ||
              (e >= 65040 && e <= 65049) ||
              (e >= 65072 && e <= 65106) ||
              (e >= 65108 && e <= 65126) ||
              (e >= 65128 && e <= 65131) ||
              (e >= 65281 && e <= 65376) ||
              (e >= 65504 && e <= 65510);
      }
      r.implement(this, o),
        (this.setDocument = function(e) {
          this.doc && this.doc.removeListener("change", this.$onChange),
            (this.doc = e),
            e.on("change", this.$onChange),
            this.bgTokenizer &&
              this.bgTokenizer.setDocument(this.getDocument()),
            this.resetCaches();
        }),
        (this.getDocument = function() {
          return this.doc;
        }),
        (this.$resetRowCache = function(e) {
          if (!e) {
            (this.$docRowCache = []), (this.$screenRowCache = []);
            return;
          }
          var t = this.$docRowCache.length,
            n = this.$getRowCacheIndex(this.$docRowCache, e) + 1;
          t > n &&
            (this.$docRowCache.splice(n, t), this.$screenRowCache.splice(n, t));
        }),
        (this.$getRowCacheIndex = function(e, t) {
          var n = 0,
            r = e.length - 1;
          while (n <= r) {
            var i = (n + r) >> 1,
              s = e[i];
            if (t > s) n = i + 1;
            else {
              if (!(t < s)) return i;
              r = i - 1;
            }
          }
          return n - 1;
        }),
        (this.resetCaches = function() {
          (this.$modified = !0),
            (this.$wrapData = []),
            (this.$rowLengthCache = []),
            this.$resetRowCache(0),
            this.bgTokenizer && this.bgTokenizer.start(0);
        }),
        (this.onChangeFold = function(e) {
          var t = e.data;
          this.$resetRowCache(t.start.row);
        }),
        (this.onChange = function(e) {
          (this.$modified = !0), this.$resetRowCache(e.start.row);
          var t = this.$updateInternalDataOnChange(e);
          !this.$fromUndo &&
            this.$undoManager &&
            !e.ignore &&
            (this.$deltasDoc.push(e),
            t &&
              t.length != 0 &&
              this.$deltasFold.push({ action: "removeFolds", folds: t }),
            this.$informUndoManager.schedule()),
            this.bgTokenizer && this.bgTokenizer.$updateOnChange(e),
            this._signal("change", e);
        }),
        (this.setValue = function(e) {
          this.doc.setValue(e),
            this.selection.moveTo(0, 0),
            this.$resetRowCache(0),
            (this.$deltas = []),
            (this.$deltasDoc = []),
            (this.$deltasFold = []),
            this.setUndoManager(this.$undoManager),
            this.getUndoManager().reset();
        }),
        (this.getValue = this.toString = function() {
          return this.doc.getValue();
        }),
        (this.getSelection = function() {
          return this.selection;
        }),
        (this.getState = function(e) {
          return this.bgTokenizer.getState(e);
        }),
        (this.getTokens = function(e) {
          return this.bgTokenizer.getTokens(e);
        }),
        (this.getTokenAt = function(e, t) {
          var n = this.bgTokenizer.getTokens(e),
            r,
            i = 0;
          if (t == null) (s = n.length - 1), (i = this.getLine(e).length);
          else
            for (var s = 0; s < n.length; s++) {
              i += n[s].value.length;
              if (i >= t) break;
            }
          return (
            (r = n[s]),
            r ? ((r.index = s), (r.start = i - r.value.length), r) : null
          );
        }),
        (this.setUndoManager = function(e) {
          (this.$undoManager = e),
            (this.$deltas = []),
            (this.$deltasDoc = []),
            (this.$deltasFold = []),
            this.$informUndoManager && this.$informUndoManager.cancel();
          if (e) {
            var t = this;
            (this.$syncInformUndoManager = function() {
              t.$informUndoManager.cancel(),
                t.$deltasFold.length &&
                  (t.$deltas.push({ group: "fold", deltas: t.$deltasFold }),
                  (t.$deltasFold = [])),
                t.$deltasDoc.length &&
                  (t.$deltas.push({ group: "doc", deltas: t.$deltasDoc }),
                  (t.$deltasDoc = [])),
                t.$deltas.length > 0 &&
                  e.execute({
                    action: "aceupdate",
                    args: [t.$deltas, t],
                    merge: t.mergeUndoDeltas
                  }),
                (t.mergeUndoDeltas = !1),
                (t.$deltas = []);
            }),
              (this.$informUndoManager = i.delayedCall(
                this.$syncInformUndoManager
              ));
          }
        }),
        (this.markUndoGroup = function() {
          this.$syncInformUndoManager && this.$syncInformUndoManager();
        }),
        (this.$defaultUndoManager = {
          undo: function() {},
          redo: function() {},
          reset: function() {}
        }),
        (this.getUndoManager = function() {
          return this.$undoManager || this.$defaultUndoManager;
        }),
        (this.getTabString = function() {
          return this.getUseSoftTabs()
            ? i.stringRepeat(" ", this.getTabSize())
            : "	";
        }),
        (this.setUseSoftTabs = function(e) {
          this.setOption("useSoftTabs", e);
        }),
        (this.getUseSoftTabs = function() {
          return this.$useSoftTabs && !this.$mode.$indentWithTabs;
        }),
        (this.setTabSize = function(e) {
          this.setOption("tabSize", e);
        }),
        (this.getTabSize = function() {
          return this.$tabSize;
        }),
        (this.isTabStop = function(e) {
          return this.$useSoftTabs && e.column % this.$tabSize === 0;
        }),
        (this.$overwrite = !1),
        (this.setOverwrite = function(e) {
          this.setOption("overwrite", e);
        }),
        (this.getOverwrite = function() {
          return this.$overwrite;
        }),
        (this.toggleOverwrite = function() {
          this.setOverwrite(!this.$overwrite);
        }),
        (this.addGutterDecoration = function(e, t) {
          this.$decorations[e] || (this.$decorations[e] = ""),
            (this.$decorations[e] += " " + t),
            this._signal("changeBreakpoint", {});
        }),
        (this.removeGutterDecoration = function(e, t) {
          (this.$decorations[e] = (this.$decorations[e] || "").replace(
            " " + t,
            ""
          )),
            this._signal("changeBreakpoint", {});
        }),
        (this.getBreakpoints = function() {
          return this.$breakpoints;
        }),
        (this.setBreakpoints = function(e) {
          this.$breakpoints = [];
          for (var t = 0; t < e.length; t++)
            this.$breakpoints[e[t]] = "ace_breakpoint";
          this._signal("changeBreakpoint", {});
        }),
        (this.clearBreakpoints = function() {
          (this.$breakpoints = []), this._signal("changeBreakpoint", {});
        }),
        (this.setBreakpoint = function(e, t) {
          t === undefined && (t = "ace_breakpoint"),
            t ? (this.$breakpoints[e] = t) : delete this.$breakpoints[e],
            this._signal("changeBreakpoint", {});
        }),
        (this.clearBreakpoint = function(e) {
          delete this.$breakpoints[e], this._signal("changeBreakpoint", {});
        }),
        (this.addMarker = function(e, t, n, r) {
          var i = this.$markerId++,
            s = {
              range: e,
              type: n || "line",
              renderer: typeof n == "function" ? n : null,
              clazz: t,
              inFront: !!r,
              id: i
            };
          return (
            r
              ? ((this.$frontMarkers[i] = s), this._signal("changeFrontMarker"))
              : ((this.$backMarkers[i] = s), this._signal("changeBackMarker")),
            i
          );
        }),
        (this.addDynamicMarker = function(e, t) {
          if (!e.update) return;
          var n = this.$markerId++;
          return (
            (e.id = n),
            (e.inFront = !!t),
            t
              ? ((this.$frontMarkers[n] = e), this._signal("changeFrontMarker"))
              : ((this.$backMarkers[n] = e), this._signal("changeBackMarker")),
            e
          );
        }),
        (this.removeMarker = function(e) {
          var t = this.$frontMarkers[e] || this.$backMarkers[e];
          if (!t) return;
          var n = t.inFront ? this.$frontMarkers : this.$backMarkers;
          t &&
            (delete n[e],
            this._signal(t.inFront ? "changeFrontMarker" : "changeBackMarker"));
        }),
        (this.getMarkers = function(e) {
          return e ? this.$frontMarkers : this.$backMarkers;
        }),
        (this.highlight = function(e) {
          if (!this.$searchHighlight) {
            var t = new h(null, "ace_selected-word", "text");
            this.$searchHighlight = this.addDynamicMarker(t);
          }
          this.$searchHighlight.setRegexp(e);
        }),
        (this.highlightLines = function(e, t, n, r) {
          typeof t != "number" && ((n = t), (t = e)), n || (n = "ace_step");
          var i = new f(e, 0, t, Infinity);
          return (i.id = this.addMarker(i, n, "fullLine", r)), i;
        }),
        (this.setAnnotations = function(e) {
          (this.$annotations = e), this._signal("changeAnnotation", {});
        }),
        (this.getAnnotations = function() {
          return this.$annotations || [];
        }),
        (this.clearAnnotations = function() {
          this.setAnnotations([]);
        }),
        (this.$detectNewLine = function(e) {
          var t = e.match(/^.*?(\r?\n)/m);
          t ? (this.$autoNewLine = t[1]) : (this.$autoNewLine = "\n");
        }),
        (this.getWordRange = function(e, t) {
          var n = this.getLine(e),
            r = !1;
          t > 0 && (r = !!n.charAt(t - 1).match(this.tokenRe)),
            r || (r = !!n.charAt(t).match(this.tokenRe));
          if (r) var i = this.tokenRe;
          else if (/^\s+$/.test(n.slice(t - 1, t + 1))) var i = /\s/;
          else var i = this.nonTokenRe;
          var s = t;
          if (s > 0) {
            do s--;
            while (s >= 0 && n.charAt(s).match(i));
            s++;
          }
          var o = t;
          while (o < n.length && n.charAt(o).match(i)) o++;
          return new f(e, s, e, o);
        }),
        (this.getAWordRange = function(e, t) {
          var n = this.getWordRange(e, t),
            r = this.getLine(n.end.row);
          while (r.charAt(n.end.column).match(/[ \t]/)) n.end.column += 1;
          return n;
        }),
        (this.setNewLineMode = function(e) {
          this.doc.setNewLineMode(e);
        }),
        (this.getNewLineMode = function() {
          return this.doc.getNewLineMode();
        }),
        (this.setUseWorker = function(e) {
          this.setOption("useWorker", e);
        }),
        (this.getUseWorker = function() {
          return this.$useWorker;
        }),
        (this.onReloadTokenizer = function(e) {
          var t = e.data;
          this.bgTokenizer.start(t.first), this._signal("tokenizerUpdate", e);
        }),
        (this.$modes = {}),
        (this.$mode = null),
        (this.$modeId = null),
        (this.setMode = function(e, t) {
          if (e && typeof e == "object") {
            if (e.getTokenizer) return this.$onChangeMode(e);
            var n = e,
              r = n.path;
          } else r = e || "ace/mode/text";
          this.$modes["ace/mode/text"] ||
            (this.$modes["ace/mode/text"] = new a());
          if (this.$modes[r] && !n) {
            this.$onChangeMode(this.$modes[r]), t && t();
            return;
          }
          (this.$modeId = r),
            s.loadModule(
              ["mode", r],
              function(e) {
                if (this.$modeId !== r) return t && t();
                this.$modes[r] && !n
                  ? this.$onChangeMode(this.$modes[r])
                  : e &&
                    e.Mode &&
                    ((e = new e.Mode(n)),
                    n || ((this.$modes[r] = e), (e.$id = r)),
                    this.$onChangeMode(e)),
                  t && t();
              }.bind(this)
            ),
            this.$mode || this.$onChangeMode(this.$modes["ace/mode/text"], !0);
        }),
        (this.$onChangeMode = function(e, t) {
          t || (this.$modeId = e.$id);
          if (this.$mode === e) return;
          (this.$mode = e),
            this.$stopWorker(),
            this.$useWorker && this.$startWorker();
          var n = e.getTokenizer();
          if (n.addEventListener !== undefined) {
            var r = this.onReloadTokenizer.bind(this);
            n.addEventListener("update", r);
          }
          if (!this.bgTokenizer) {
            this.bgTokenizer = new c(n);
            var i = this;
            this.bgTokenizer.addEventListener("update", function(e) {
              i._signal("tokenizerUpdate", e);
            });
          } else this.bgTokenizer.setTokenizer(n);
          this.bgTokenizer.setDocument(this.getDocument()),
            (this.tokenRe = e.tokenRe),
            (this.nonTokenRe = e.nonTokenRe),
            t ||
              (e.attachToSession && e.attachToSession(this),
              this.$options.wrapMethod.set.call(this, this.$wrapMethod),
              this.$setFolding(e.foldingRules),
              this.bgTokenizer.start(0),
              this._emit("changeMode"));
        }),
        (this.$stopWorker = function() {
          this.$worker && (this.$worker.terminate(), (this.$worker = null));
        }),
        (this.$startWorker = function() {
          try {
            this.$worker = this.$mode.createWorker(this);
          } catch (e) {
            s.warn("Could not load worker", e), (this.$worker = null);
          }
        }),
        (this.getMode = function() {
          return this.$mode;
        }),
        (this.$scrollTop = 0),
        (this.setScrollTop = function(e) {
          if (this.$scrollTop === e || isNaN(e)) return;
          (this.$scrollTop = e), this._signal("changeScrollTop", e);
        }),
        (this.getScrollTop = function() {
          return this.$scrollTop;
        }),
        (this.$scrollLeft = 0),
        (this.setScrollLeft = function(e) {
          if (this.$scrollLeft === e || isNaN(e)) return;
          (this.$scrollLeft = e), this._signal("changeScrollLeft", e);
        }),
        (this.getScrollLeft = function() {
          return this.$scrollLeft;
        }),
        (this.getScreenWidth = function() {
          return (
            this.$computeWidth(),
            this.lineWidgets
              ? Math.max(this.getLineWidgetMaxWidth(), this.screenWidth)
              : this.screenWidth
          );
        }),
        (this.getLineWidgetMaxWidth = function() {
          if (this.lineWidgetsWidth != null) return this.lineWidgetsWidth;
          var e = 0;
          return (
            this.lineWidgets.forEach(function(t) {
              t && t.screenWidth > e && (e = t.screenWidth);
            }),
            (this.lineWidgetWidth = e)
          );
        }),
        (this.$computeWidth = function(e) {
          if (this.$modified || e) {
            this.$modified = !1;
            if (this.$useWrapMode) return (this.screenWidth = this.$wrapLimit);
            var t = this.doc.getAllLines(),
              n = this.$rowLengthCache,
              r = 0,
              i = 0,
              s = this.$foldData[i],
              o = s ? s.start.row : Infinity,
              u = t.length;
            for (var a = 0; a < u; a++) {
              if (a > o) {
                a = s.end.row + 1;
                if (a >= u) break;
                (s = this.$foldData[i++]), (o = s ? s.start.row : Infinity);
              }
              n[a] == null && (n[a] = this.$getStringScreenWidth(t[a])[0]),
                n[a] > r && (r = n[a]);
            }
            this.screenWidth = r;
          }
        }),
        (this.getLine = function(e) {
          return this.doc.getLine(e);
        }),
        (this.getLines = function(e, t) {
          return this.doc.getLines(e, t);
        }),
        (this.getLength = function() {
          return this.doc.getLength();
        }),
        (this.getTextRange = function(e) {
          return this.doc.getTextRange(e || this.selection.getRange());
        }),
        (this.insert = function(e, t) {
          return this.doc.insert(e, t);
        }),
        (this.remove = function(e) {
          return this.doc.remove(e);
        }),
        (this.removeFullLines = function(e, t) {
          return this.doc.removeFullLines(e, t);
        }),
        (this.undoChanges = function(e, t) {
          if (!e.length) return;
          this.$fromUndo = !0;
          var n = null;
          for (var r = e.length - 1; r != -1; r--) {
            var i = e[r];
            i.group == "doc"
              ? (this.doc.revertDeltas(i.deltas),
                (n = this.$getUndoSelection(i.deltas, !0, n)))
              : i.deltas.forEach(function(e) {
                  this.addFolds(e.folds);
                }, this);
          }
          return (
            (this.$fromUndo = !1),
            n && this.$undoSelect && !t && this.selection.setSelectionRange(n),
            n
          );
        }),
        (this.redoChanges = function(e, t) {
          if (!e.length) return;
          this.$fromUndo = !0;
          var n = null;
          for (var r = 0; r < e.length; r++) {
            var i = e[r];
            i.group == "doc" &&
              (this.doc.applyDeltas(i.deltas),
              (n = this.$getUndoSelection(i.deltas, !1, n)));
          }
          return (
            (this.$fromUndo = !1),
            n && this.$undoSelect && !t && this.selection.setSelectionRange(n),
            n
          );
        }),
        (this.setUndoSelect = function(e) {
          this.$undoSelect = e;
        }),
        (this.$getUndoSelection = function(e, t, n) {
          function r(e) {
            return t ? e.action !== "insert" : e.action === "insert";
          }
          var i = e[0],
            s,
            o,
            u = !1;
          r(i)
            ? ((s = f.fromPoints(i.start, i.end)), (u = !0))
            : ((s = f.fromPoints(i.start, i.start)), (u = !1));
          for (var a = 1; a < e.length; a++)
            (i = e[a]),
              r(i)
                ? ((o = i.start),
                  s.compare(o.row, o.column) == -1 && s.setStart(o),
                  (o = i.end),
                  s.compare(o.row, o.column) == 1 && s.setEnd(o),
                  (u = !0))
                : ((o = i.start),
                  s.compare(o.row, o.column) == -1 &&
                    (s = f.fromPoints(i.start, i.start)),
                  (u = !1));
          if (n != null) {
            f.comparePoints(n.start, s.start) === 0 &&
              ((n.start.column += s.end.column - s.start.column),
              (n.end.column += s.end.column - s.start.column));
            var l = n.compareRange(s);
            l == 1 ? s.setStart(n.start) : l == -1 && s.setEnd(n.end);
          }
          return s;
        }),
        (this.replace = function(e, t) {
          return this.doc.replace(e, t);
        }),
        (this.moveText = function(e, t, n) {
          var r = this.getTextRange(e),
            i = this.getFoldsInRange(e),
            s = f.fromPoints(t, t);
          if (!n) {
            this.remove(e);
            var o = e.start.row - e.end.row,
              u = o ? -e.end.column : e.start.column - e.end.column;
            u &&
              (s.start.row == e.end.row &&
                s.start.column > e.end.column &&
                (s.start.column += u),
              s.end.row == e.end.row &&
                s.end.column > e.end.column &&
                (s.end.column += u)),
              o &&
                s.start.row >= e.end.row &&
                ((s.start.row += o), (s.end.row += o));
          }
          s.end = this.insert(s.start, r);
          if (i.length) {
            var a = e.start,
              l = s.start,
              o = l.row - a.row,
              u = l.column - a.column;
            this.addFolds(
              i.map(function(e) {
                return (
                  (e = e.clone()),
                  e.start.row == a.row && (e.start.column += u),
                  e.end.row == a.row && (e.end.column += u),
                  (e.start.row += o),
                  (e.end.row += o),
                  e
                );
              })
            );
          }
          return s;
        }),
        (this.indentRows = function(e, t, n) {
          n = n.replace(/\t/g, this.getTabString());
          for (var r = e; r <= t; r++)
            this.doc.insertInLine({ row: r, column: 0 }, n);
        }),
        (this.outdentRows = function(e) {
          var t = e.collapseRows(),
            n = new f(0, 0, 0, 0),
            r = this.getTabSize();
          for (var i = t.start.row; i <= t.end.row; ++i) {
            var s = this.getLine(i);
            (n.start.row = i), (n.end.row = i);
            for (var o = 0; o < r; ++o) if (s.charAt(o) != " ") break;
            o < r && s.charAt(o) == "	"
              ? ((n.start.column = o), (n.end.column = o + 1))
              : ((n.start.column = 0), (n.end.column = o)),
              this.remove(n);
          }
        }),
        (this.$moveLines = function(e, t, n) {
          (e = this.getRowFoldStart(e)), (t = this.getRowFoldEnd(t));
          if (n < 0) {
            var r = this.getRowFoldStart(e + n);
            if (r < 0) return 0;
            var i = r - e;
          } else if (n > 0) {
            var r = this.getRowFoldEnd(t + n);
            if (r > this.doc.getLength() - 1) return 0;
            var i = r - t;
          } else {
            (e = this.$clipRowToDocument(e)), (t = this.$clipRowToDocument(t));
            var i = t - e + 1;
          }
          var s = new f(e, 0, t, Number.MAX_VALUE),
            o = this.getFoldsInRange(s).map(function(e) {
              return (e = e.clone()), (e.start.row += i), (e.end.row += i), e;
            }),
            u =
              n == 0 ? this.doc.getLines(e, t) : this.doc.removeFullLines(e, t);
          return (
            this.doc.insertFullLines(e + i, u), o.length && this.addFolds(o), i
          );
        }),
        (this.moveLinesUp = function(e, t) {
          return this.$moveLines(e, t, -1);
        }),
        (this.moveLinesDown = function(e, t) {
          return this.$moveLines(e, t, 1);
        }),
        (this.duplicateLines = function(e, t) {
          return this.$moveLines(e, t, 0);
        }),
        (this.$clipRowToDocument = function(e) {
          return Math.max(0, Math.min(e, this.doc.getLength() - 1));
        }),
        (this.$clipColumnToRow = function(e, t) {
          return t < 0 ? 0 : Math.min(this.doc.getLine(e).length, t);
        }),
        (this.$clipPositionToDocument = function(e, t) {
          t = Math.max(0, t);
          if (e < 0) (e = 0), (t = 0);
          else {
            var n = this.doc.getLength();
            e >= n
              ? ((e = n - 1), (t = this.doc.getLine(n - 1).length))
              : (t = Math.min(this.doc.getLine(e).length, t));
          }
          return { row: e, column: t };
        }),
        (this.$clipRangeToDocument = function(e) {
          e.start.row < 0
            ? ((e.start.row = 0), (e.start.column = 0))
            : (e.start.column = this.$clipColumnToRow(
                e.start.row,
                e.start.column
              ));
          var t = this.doc.getLength() - 1;
          return (
            e.end.row > t
              ? ((e.end.row = t), (e.end.column = this.doc.getLine(t).length))
              : (e.end.column = this.$clipColumnToRow(e.end.row, e.end.column)),
            e
          );
        }),
        (this.$wrapLimit = 80),
        (this.$useWrapMode = !1),
        (this.$wrapLimitRange = { min: null, max: null }),
        (this.setUseWrapMode = function(e) {
          if (e != this.$useWrapMode) {
            (this.$useWrapMode = e),
              (this.$modified = !0),
              this.$resetRowCache(0);
            if (e) {
              var t = this.getLength();
              (this.$wrapData = Array(t)), this.$updateWrapData(0, t - 1);
            }
            this._signal("changeWrapMode");
          }
        }),
        (this.getUseWrapMode = function() {
          return this.$useWrapMode;
        }),
        (this.setWrapLimitRange = function(e, t) {
          if (this.$wrapLimitRange.min !== e || this.$wrapLimitRange.max !== t)
            (this.$wrapLimitRange = { min: e, max: t }),
              (this.$modified = !0),
              this.$useWrapMode && this._signal("changeWrapMode");
        }),
        (this.adjustWrapLimit = function(e, t) {
          var n = this.$wrapLimitRange;
          n.max < 0 && (n = { min: t, max: t });
          var r = this.$constrainWrapLimit(e, n.min, n.max);
          return r != this.$wrapLimit && r > 1
            ? ((this.$wrapLimit = r),
              (this.$modified = !0),
              this.$useWrapMode &&
                (this.$updateWrapData(0, this.getLength() - 1),
                this.$resetRowCache(0),
                this._signal("changeWrapLimit")),
              !0)
            : !1;
        }),
        (this.$constrainWrapLimit = function(e, t, n) {
          return t && (e = Math.max(t, e)), n && (e = Math.min(n, e)), e;
        }),
        (this.getWrapLimit = function() {
          return this.$wrapLimit;
        }),
        (this.setWrapLimit = function(e) {
          this.setWrapLimitRange(e, e);
        }),
        (this.getWrapLimitRange = function() {
          return {
            min: this.$wrapLimitRange.min,
            max: this.$wrapLimitRange.max
          };
        }),
        (this.$updateInternalDataOnChange = function(e) {
          var t = this.$useWrapMode,
            n = e.action,
            r = e.start,
            i = e.end,
            s = r.row,
            o = i.row,
            u = o - s,
            a = null;
          this.$updating = !0;
          if (u != 0)
            if (n === "remove") {
              this[t ? "$wrapData" : "$rowLengthCache"].splice(s, u);
              var f = this.$foldData;
              (a = this.getFoldsInRange(e)), this.removeFolds(a);
              var l = this.getFoldLine(i.row),
                c = 0;
              if (l) {
                l.addRemoveChars(i.row, i.column, r.column - i.column),
                  l.shiftRow(-u);
                var h = this.getFoldLine(s);
                h && h !== l && (h.merge(l), (l = h)), (c = f.indexOf(l) + 1);
              }
              for (c; c < f.length; c++) {
                var l = f[c];
                l.start.row >= i.row && l.shiftRow(-u);
              }
              o = s;
            } else {
              var p = Array(u);
              p.unshift(s, 0);
              var d = t ? this.$wrapData : this.$rowLengthCache;
              d.splice.apply(d, p);
              var f = this.$foldData,
                l = this.getFoldLine(s),
                c = 0;
              if (l) {
                var v = l.range.compareInside(r.row, r.column);
                v == 0
                  ? ((l = l.split(r.row, r.column)),
                    l &&
                      (l.shiftRow(u),
                      l.addRemoveChars(o, 0, i.column - r.column)))
                  : v == -1 &&
                    (l.addRemoveChars(s, 0, i.column - r.column),
                    l.shiftRow(u)),
                  (c = f.indexOf(l) + 1);
              }
              for (c; c < f.length; c++) {
                var l = f[c];
                l.start.row >= s && l.shiftRow(u);
              }
            }
          else {
            (u = Math.abs(e.start.column - e.end.column)),
              n === "remove" &&
                ((a = this.getFoldsInRange(e)), this.removeFolds(a), (u = -u));
            var l = this.getFoldLine(s);
            l && l.addRemoveChars(s, r.column, u);
          }
          return (
            t &&
              this.$wrapData.length != this.doc.getLength() &&
              console.error(
                "doc.getLength() and $wrapData.length have to be the same!"
              ),
            (this.$updating = !1),
            t ? this.$updateWrapData(s, o) : this.$updateRowLengthCache(s, o),
            a
          );
        }),
        (this.$updateRowLengthCache = function(e, t, n) {
          (this.$rowLengthCache[e] = null), (this.$rowLengthCache[t] = null);
        }),
        (this.$updateWrapData = function(e, t) {
          var r = this.doc.getAllLines(),
            i = this.getTabSize(),
            s = this.$wrapData,
            o = this.$wrapLimit,
            a,
            f,
            l = e;
          t = Math.min(t, r.length - 1);
          while (l <= t)
            (f = this.getFoldLine(l, f)),
              f
                ? ((a = []),
                  f.walk(
                    function(e, t, i, s) {
                      var o;
                      if (e != null) {
                        (o = this.$getDisplayTokens(e, a.length)), (o[0] = n);
                        for (var f = 1; f < o.length; f++) o[f] = u;
                      } else
                        o = this.$getDisplayTokens(
                          r[t].substring(s, i),
                          a.length
                        );
                      a = a.concat(o);
                    }.bind(this),
                    f.end.row,
                    r[f.end.row].length + 1
                  ),
                  (s[f.start.row] = this.$computeWrapSplits(a, o, i)),
                  (l = f.end.row + 1))
                : ((a = this.$getDisplayTokens(r[l])),
                  (s[l] = this.$computeWrapSplits(a, o, i)),
                  l++);
        });
      var e = 1,
        t = 2,
        n = 3,
        u = 4,
        l = 9,
        p = 10,
        d = 11,
        v = 12;
      (this.$computeWrapSplits = function(e, r, i) {
        function g() {
          var t = 0;
          if (m === 0) return t;
          if (h)
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              if (r == p) t += 1;
              else {
                if (r != d) {
                  if (r == v) continue;
                  break;
                }
                t += i;
              }
            }
          return c && h !== !1 && (t += i), Math.min(t, m);
        }
        function y(t) {
          var n = e.slice(a, t),
            r = n.length;
          n
            .join("")
            .replace(/12/g, function() {
              r -= 1;
            })
            .replace(/2/g, function() {
              r -= 1;
            }),
            s.length || ((b = g()), (s.indent = b)),
            (f += r),
            s.push(f),
            (a = t);
        }
        if (e.length == 0) return [];
        var s = [],
          o = e.length,
          a = 0,
          f = 0,
          c = this.$wrapAsCode,
          h = this.$indentedSoftWrap,
          m = r <= Math.max(2 * i, 8) || h === !1 ? 0 : Math.floor(r / 2),
          b = 0;
        while (o - a > r - b) {
          var w = a + r - b;
          if (e[w - 1] >= p && e[w] >= p) {
            y(w);
            continue;
          }
          if (e[w] == n || e[w] == u) {
            for (w; w != a - 1; w--) if (e[w] == n) break;
            if (w > a) {
              y(w);
              continue;
            }
            w = a + r;
            for (w; w < e.length; w++) if (e[w] != u) break;
            if (w == e.length) break;
            y(w);
            continue;
          }
          var E = Math.max(w - (r - (r >> 2)), a - 1);
          while (w > E && e[w] < n) w--;
          if (c) {
            while (w > E && e[w] < n) w--;
            while (w > E && e[w] == l) w--;
          } else while (w > E && e[w] < p) w--;
          if (w > E) {
            y(++w);
            continue;
          }
          (w = a + r), e[w] == t && w--, y(w - b);
        }
        return s;
      }),
        (this.$getDisplayTokens = function(n, r) {
          var i = [],
            s;
          r = r || 0;
          for (var o = 0; o < n.length; o++) {
            var u = n.charCodeAt(o);
            if (u == 9) {
              (s = this.getScreenTabSize(i.length + r)), i.push(d);
              for (var a = 1; a < s; a++) i.push(v);
            } else
              u == 32
                ? i.push(p)
                : (u > 39 && u < 48) || (u > 57 && u < 64)
                ? i.push(l)
                : u >= 4352 && m(u)
                ? i.push(e, t)
                : i.push(e);
          }
          return i;
        }),
        (this.$getStringScreenWidth = function(e, t, n) {
          if (t == 0) return [0, 0];
          t == null && (t = Infinity), (n = n || 0);
          var r, i;
          for (i = 0; i < e.length; i++) {
            (r = e.charCodeAt(i)),
              r == 9
                ? (n += this.getScreenTabSize(n))
                : r >= 4352 && m(r)
                ? (n += 2)
                : (n += 1);
            if (n > t) break;
          }
          return [n, i];
        }),
        (this.lineWidgets = null),
        (this.getRowLength = function(e) {
          if (this.lineWidgets)
            var t = (this.lineWidgets[e] && this.lineWidgets[e].rowCount) || 0;
          else t = 0;
          return !this.$useWrapMode || !this.$wrapData[e]
            ? 1 + t
            : this.$wrapData[e].length + 1 + t;
        }),
        (this.getRowLineCount = function(e) {
          return !this.$useWrapMode || !this.$wrapData[e]
            ? 1
            : this.$wrapData[e].length + 1;
        }),
        (this.getRowWrapIndent = function(e) {
          if (this.$useWrapMode) {
            var t = this.screenToDocumentPosition(e, Number.MAX_VALUE),
              n = this.$wrapData[t.row];
            return n.length && n[0] < t.column ? n.indent : 0;
          }
          return 0;
        }),
        (this.getScreenLastRowColumn = function(e) {
          var t = this.screenToDocumentPosition(e, Number.MAX_VALUE);
          return this.documentToScreenColumn(t.row, t.column);
        }),
        (this.getDocumentLastRowColumn = function(e, t) {
          var n = this.documentToScreenRow(e, t);
          return this.getScreenLastRowColumn(n);
        }),
        (this.getDocumentLastRowColumnPosition = function(e, t) {
          var n = this.documentToScreenRow(e, t);
          return this.screenToDocumentPosition(n, Number.MAX_VALUE / 10);
        }),
        (this.getRowSplitData = function(e) {
          return this.$useWrapMode ? this.$wrapData[e] : undefined;
        }),
        (this.getScreenTabSize = function(e) {
          return this.$tabSize - (e % this.$tabSize);
        }),
        (this.screenToDocumentRow = function(e, t) {
          return this.screenToDocumentPosition(e, t).row;
        }),
        (this.screenToDocumentColumn = function(e, t) {
          return this.screenToDocumentPosition(e, t).column;
        }),
        (this.screenToDocumentPosition = function(e, t) {
          if (e < 0) return { row: 0, column: 0 };
          var n,
            r = 0,
            i = 0,
            s,
            o = 0,
            u = 0,
            a = this.$screenRowCache,
            f = this.$getRowCacheIndex(a, e),
            l = a.length;
          if (l && f >= 0)
            var o = a[f],
              r = this.$docRowCache[f],
              c = e > a[l - 1];
          else var c = !l;
          var h = this.getLength() - 1,
            p = this.getNextFoldLine(r),
            d = p ? p.start.row : Infinity;
          while (o <= e) {
            u = this.getRowLength(r);
            if (o + u > e || r >= h) break;
            (o += u),
              r++,
              r > d &&
                ((r = p.end.row + 1),
                (p = this.getNextFoldLine(r, p)),
                (d = p ? p.start.row : Infinity)),
              c && (this.$docRowCache.push(r), this.$screenRowCache.push(o));
          }
          if (p && p.start.row <= r)
            (n = this.getFoldDisplayLine(p)), (r = p.start.row);
          else {
            if (o + u <= e || r > h)
              return { row: h, column: this.getLine(h).length };
            (n = this.getLine(r)), (p = null);
          }
          var v = 0;
          if (this.$useWrapMode) {
            var m = this.$wrapData[r];
            if (m) {
              var g = Math.floor(e - o);
              (s = m[g]),
                g > 0 &&
                  m.length &&
                  ((v = m.indent),
                  (i = m[g - 1] || m[m.length - 1]),
                  (n = n.substring(i)));
            }
          }
          return (
            (i += this.$getStringScreenWidth(n, t - v)[1]),
            this.$useWrapMode && i >= s && (i = s - 1),
            p ? p.idxToPosition(i) : { row: r, column: i }
          );
        }),
        (this.documentToScreenPosition = function(e, t) {
          if (typeof t == "undefined")
            var n = this.$clipPositionToDocument(e.row, e.column);
          else n = this.$clipPositionToDocument(e, t);
          (e = n.row), (t = n.column);
          var r = 0,
            i = null,
            s = null;
          (s = this.getFoldAt(e, t, 1)),
            s && ((e = s.start.row), (t = s.start.column));
          var o,
            u = 0,
            a = this.$docRowCache,
            f = this.$getRowCacheIndex(a, e),
            l = a.length;
          if (l && f >= 0)
            var u = a[f],
              r = this.$screenRowCache[f],
              c = e > a[l - 1];
          else var c = !l;
          var h = this.getNextFoldLine(u),
            p = h ? h.start.row : Infinity;
          while (u < e) {
            if (u >= p) {
              o = h.end.row + 1;
              if (o > e) break;
              (h = this.getNextFoldLine(o, h)),
                (p = h ? h.start.row : Infinity);
            } else o = u + 1;
            (r += this.getRowLength(u)),
              (u = o),
              c && (this.$docRowCache.push(u), this.$screenRowCache.push(r));
          }
          var d = "";
          h && u >= p
            ? ((d = this.getFoldDisplayLine(h, e, t)), (i = h.start.row))
            : ((d = this.getLine(e).substring(0, t)), (i = e));
          var v = 0;
          if (this.$useWrapMode) {
            var m = this.$wrapData[i];
            if (m) {
              var g = 0;
              while (d.length >= m[g]) r++, g++;
              (d = d.substring(m[g - 1] || 0, d.length)),
                (v = g > 0 ? m.indent : 0);
            }
          }
          return { row: r, column: v + this.$getStringScreenWidth(d)[0] };
        }),
        (this.documentToScreenColumn = function(e, t) {
          return this.documentToScreenPosition(e, t).column;
        }),
        (this.documentToScreenRow = function(e, t) {
          return this.documentToScreenPosition(e, t).row;
        }),
        (this.getScreenLength = function() {
          var e = 0,
            t = null;
          if (!this.$useWrapMode) {
            e = this.getLength();
            var n = this.$foldData;
            for (var r = 0; r < n.length; r++)
              (t = n[r]), (e -= t.end.row - t.start.row);
          } else {
            var i = this.$wrapData.length,
              s = 0,
              r = 0,
              t = this.$foldData[r++],
              o = t ? t.start.row : Infinity;
            while (s < i) {
              var u = this.$wrapData[s];
              (e += u ? u.length + 1 : 1),
                s++,
                s > o &&
                  ((s = t.end.row + 1),
                  (t = this.$foldData[r++]),
                  (o = t ? t.start.row : Infinity));
            }
          }
          return this.lineWidgets && (e += this.$getWidgetScreenLength()), e;
        }),
        (this.$setFontMetrics = function(e) {
          if (!this.$enableVarChar) return;
          this.$getStringScreenWidth = function(t, n, r) {
            if (n === 0) return [0, 0];
            n || (n = Infinity), (r = r || 0);
            var i, s;
            for (s = 0; s < t.length; s++) {
              (i = t.charAt(s)),
                i === "	"
                  ? (r += this.getScreenTabSize(r))
                  : (r += e.getCharacterWidth(i));
              if (r > n) break;
            }
            return [r, s];
          };
        }),
        (this.destroy = function() {
          this.bgTokenizer &&
            (this.bgTokenizer.setDocument(null), (this.bgTokenizer = null)),
            this.$stopWorker();
        });
    }.call(p.prototype),
      e("./edit_session/folding").Folding.call(p.prototype),
      e("./edit_session/bracket_match").BracketMatch.call(p.prototype),
      s.defineOptions(p.prototype, "session", {
        wrap: {
          set: function(e) {
            !e || e == "off"
              ? (e = !1)
              : e == "free"
              ? (e = !0)
              : e == "printMargin"
              ? (e = -1)
              : typeof e == "string" && (e = parseInt(e, 10) || !1);
            if (this.$wrap == e) return;
            this.$wrap = e;
            if (!e) this.setUseWrapMode(!1);
            else {
              var t = typeof e == "number" ? e : null;
              this.setWrapLimitRange(t, t), this.setUseWrapMode(!0);
            }
          },
          get: function() {
            return this.getUseWrapMode()
              ? this.$wrap == -1
                ? "printMargin"
                : this.getWrapLimitRange().min
                ? this.$wrap
                : "free"
              : "off";
          },
          handlesSet: !0
        },
        wrapMethod: {
          set: function(e) {
            (e = e == "auto" ? this.$mode.type != "text" : e != "text"),
              e != this.$wrapAsCode &&
                ((this.$wrapAsCode = e),
                this.$useWrapMode &&
                  ((this.$modified = !0),
                  this.$resetRowCache(0),
                  this.$updateWrapData(0, this.getLength() - 1)));
          },
          initialValue: "auto"
        },
        indentedSoftWrap: { initialValue: !0 },
        firstLineNumber: {
          set: function() {
            this._signal("changeBreakpoint");
          },
          initialValue: 1
        },
        useWorker: {
          set: function(e) {
            (this.$useWorker = e), this.$stopWorker(), e && this.$startWorker();
          },
          initialValue: !0
        },
        useSoftTabs: { initialValue: !0 },
        tabSize: {
          set: function(e) {
            if (isNaN(e) || this.$tabSize === e) return;
            (this.$modified = !0),
              (this.$rowLengthCache = []),
              (this.$tabSize = e),
              this._signal("changeTabSize");
          },
          initialValue: 4,
          handlesSet: !0
        },
        overwrite: {
          set: function(e) {
            this._signal("changeOverwrite");
          },
          initialValue: !1
        },
        newLineMode: {
          set: function(e) {
            this.doc.setNewLineMode(e);
          },
          get: function() {
            return this.doc.getNewLineMode();
          },
          handlesSet: !0
        },
        mode: {
          set: function(e) {
            this.setMode(e);
          },
          get: function() {
            return this.$modeId;
          }
        }
      }),
      (t.EditSession = p));
  }),

}
