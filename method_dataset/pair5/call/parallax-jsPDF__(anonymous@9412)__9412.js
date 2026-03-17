function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    e("./lib/fixoldbrowsers");
    var r = e("./lib/oop"),
      i = e("./lib/dom"),
      s = e("./lib/lang"),
      o = e("./lib/useragent"),
      u = e("./keyboard/textinput").TextInput,
      a = e("./mouse/mouse_handler").MouseHandler,
      f = e("./mouse/fold_handler").FoldHandler,
      l = e("./keyboard/keybinding").KeyBinding,
      c = e("./edit_session").EditSession,
      h = e("./search").Search,
      p = e("./range").Range,
      d = e("./lib/event_emitter").EventEmitter,
      v = e("./commands/command_manager").CommandManager,
      m = e("./commands/default_commands").commands,
      g = e("./config"),
      y = e("./token_iterator").TokenIterator,
      b = function(e, t) {
        var n = e.getContainerElement();
        (this.container = n),
          (this.renderer = e),
          (this.commands = new v(o.isMac ? "mac" : "win", m)),
          (this.textInput = new u(e.getTextAreaContainer(), this)),
          (this.renderer.textarea = this.textInput.getElement()),
          (this.keyBinding = new l(this)),
          (this.$mouseHandler = new a(this)),
          new f(this),
          (this.$blockScrolling = 0),
          (this.$search = new h().set({ wrap: !0 })),
          (this.$historyTracker = this.$historyTracker.bind(this)),
          this.commands.on("exec", this.$historyTracker),
          this.$initOperationListeners(),
          (this._$emitInputEvent = s.delayedCall(
            function() {
              this._signal("input", {}),
                this.session &&
                  this.session.bgTokenizer &&
                  this.session.bgTokenizer.scheduleStart();
            }.bind(this)
          )),
          this.on("change", function(e, t) {
            t._$emitInputEvent.schedule(31);
          }),
          this.setSession(t || new c("")),
          g.resetOptions(this),
          g._signal("editor", this);
      };
    (function() {
      r.implement(this, d),
        (this.$initOperationListeners = function() {
          function e(e) {
            return e[e.length - 1];
          }
          (this.selections = []),
            this.commands.on("exec", this.startOperation.bind(this), !0),
            this.commands.on("afterExec", this.endOperation.bind(this), !0),
            (this.$opResetTimer = s.delayedCall(this.endOperation.bind(this))),
            this.on(
              "change",
              function() {
                this.curOp || this.startOperation(),
                  (this.curOp.docChanged = !0);
              }.bind(this),
              !0
            ),
            this.on(
              "changeSelection",
              function() {
                this.curOp || this.startOperation(),
                  (this.curOp.selectionChanged = !0);
              }.bind(this),
              !0
            );
        }),
        (this.curOp = null),
        (this.prevOp = {}),
        (this.startOperation = function(e) {
          if (this.curOp) {
            if (!e || this.curOp.command) return;
            this.prevOp = this.curOp;
          }
          e || ((this.previousCommand = null), (e = {})),
            this.$opResetTimer.schedule(),
            (this.curOp = {
              command: e.command || {},
              args: e.args,
              scrollTop: this.renderer.scrollTop
            }),
            this.curOp.command.name &&
              this.curOp.command.scrollIntoView !== undefined &&
              this.$blockScrolling++;
        }),
        (this.endOperation = function(e) {
          if (this.curOp) {
            if (e && e.returnValue === !1) return (this.curOp = null);
            this._signal("beforeEndOperation");
            var t = this.curOp.command;
            t.name && this.$blockScrolling > 0 && this.$blockScrolling--;
            var n = t && t.scrollIntoView;
            if (n) {
              switch (n) {
                case "center-animate":
                  n = "animate";
                case "center":
                  this.renderer.scrollCursorIntoView(null, 0.5);
                  break;
                case "animate":
                case "cursor":
                  this.renderer.scrollCursorIntoView();
                  break;
                case "selectionPart":
                  var r = this.selection.getRange(),
                    i = this.renderer.layerConfig;
                  (r.start.row >= i.lastRow || r.end.row <= i.firstRow) &&
                    this.renderer.scrollSelectionIntoView(
                      this.selection.anchor,
                      this.selection.lead
                    );
                  break;
                default:
              }
              n == "animate" &&
                this.renderer.animateScrolling(this.curOp.scrollTop);
            }
            (this.prevOp = this.curOp), (this.curOp = null);
          }
        }),
        (this.$mergeableCommands = ["backspace", "del", "insertstring"]),
        (this.$historyTracker = function(e) {
          if (!this.$mergeUndoDeltas) return;
          var t = this.prevOp,
            n = this.$mergeableCommands,
            r = t.command && e.command.name == t.command.name;
          if (e.command.name == "insertstring") {
            var i = e.args;
            this.mergeNextCommand === undefined && (this.mergeNextCommand = !0),
              (r =
                r &&
                this.mergeNextCommand &&
                (!/\s/.test(i) || /\s/.test(t.args))),
              (this.mergeNextCommand = !0);
          } else r = r && n.indexOf(e.command.name) !== -1;
          this.$mergeUndoDeltas != "always" &&
            Date.now() - this.sequenceStartTime > 2e3 &&
            (r = !1),
            r
              ? (this.session.mergeUndoDeltas = !0)
              : n.indexOf(e.command.name) !== -1 &&
                (this.sequenceStartTime = Date.now());
        }),
        (this.setKeyboardHandler = function(e, t) {
          if (e && typeof e == "string") {
            this.$keybindingId = e;
            var n = this;
            g.loadModule(["keybinding", e], function(r) {
              n.$keybindingId == e &&
                n.keyBinding.setKeyboardHandler(r && r.handler),
                t && t();
            });
          } else
            (this.$keybindingId = null),
              this.keyBinding.setKeyboardHandler(e),
              t && t();
        }),
        (this.getKeyboardHandler = function() {
          return this.keyBinding.getKeyboardHandler();
        }),
        (this.setSession = function(e) {
          if (this.session == e) return;
          this.curOp && this.endOperation(), (this.curOp = {});
          var t = this.session;
          if (t) {
            this.session.off("change", this.$onDocumentChange),
              this.session.off("changeMode", this.$onChangeMode),
              this.session.off("tokenizerUpdate", this.$onTokenizerUpdate),
              this.session.off("changeTabSize", this.$onChangeTabSize),
              this.session.off("changeWrapLimit", this.$onChangeWrapLimit),
              this.session.off("changeWrapMode", this.$onChangeWrapMode),
              this.session.off("changeFold", this.$onChangeFold),
              this.session.off("changeFrontMarker", this.$onChangeFrontMarker),
              this.session.off("changeBackMarker", this.$onChangeBackMarker),
              this.session.off("changeBreakpoint", this.$onChangeBreakpoint),
              this.session.off("changeAnnotation", this.$onChangeAnnotation),
              this.session.off("changeOverwrite", this.$onCursorChange),
              this.session.off("changeScrollTop", this.$onScrollTopChange),
              this.session.off("changeScrollLeft", this.$onScrollLeftChange);
            var n = this.session.getSelection();
            n.off("changeCursor", this.$onCursorChange),
              n.off("changeSelection", this.$onSelectionChange);
          }
          (this.session = e),
            e
              ? ((this.$onDocumentChange = this.onDocumentChange.bind(this)),
                e.on("change", this.$onDocumentChange),
                this.renderer.setSession(e),
                (this.$onChangeMode = this.onChangeMode.bind(this)),
                e.on("changeMode", this.$onChangeMode),
                (this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this)),
                e.on("tokenizerUpdate", this.$onTokenizerUpdate),
                (this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(
                  this.renderer
                )),
                e.on("changeTabSize", this.$onChangeTabSize),
                (this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this)),
                e.on("changeWrapLimit", this.$onChangeWrapLimit),
                (this.$onChangeWrapMode = this.onChangeWrapMode.bind(this)),
                e.on("changeWrapMode", this.$onChangeWrapMode),
                (this.$onChangeFold = this.onChangeFold.bind(this)),
                e.on("changeFold", this.$onChangeFold),
                (this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(
                  this
                )),
                this.session.on("changeFrontMarker", this.$onChangeFrontMarker),
                (this.$onChangeBackMarker = this.onChangeBackMarker.bind(this)),
                this.session.on("changeBackMarker", this.$onChangeBackMarker),
                (this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this)),
                this.session.on("changeBreakpoint", this.$onChangeBreakpoint),
                (this.$onChangeAnnotation = this.onChangeAnnotation.bind(this)),
                this.session.on("changeAnnotation", this.$onChangeAnnotation),
                (this.$onCursorChange = this.onCursorChange.bind(this)),
                this.session.on("changeOverwrite", this.$onCursorChange),
                (this.$onScrollTopChange = this.onScrollTopChange.bind(this)),
                this.session.on("changeScrollTop", this.$onScrollTopChange),
                (this.$onScrollLeftChange = this.onScrollLeftChange.bind(this)),
                this.session.on("changeScrollLeft", this.$onScrollLeftChange),
                (this.selection = e.getSelection()),
                this.selection.on("changeCursor", this.$onCursorChange),
                (this.$onSelectionChange = this.onSelectionChange.bind(this)),
                this.selection.on("changeSelection", this.$onSelectionChange),
                this.onChangeMode(),
                (this.$blockScrolling += 1),
                this.onCursorChange(),
                (this.$blockScrolling -= 1),
                this.onScrollTopChange(),
                this.onScrollLeftChange(),
                this.onSelectionChange(),
                this.onChangeFrontMarker(),
                this.onChangeBackMarker(),
                this.onChangeBreakpoint(),
                this.onChangeAnnotation(),
                this.session.getUseWrapMode() &&
                  this.renderer.adjustWrapLimit(),
                this.renderer.updateFull())
              : ((this.selection = null), this.renderer.setSession(e)),
            this._signal("changeSession", { session: e, oldSession: t }),
            (this.curOp = null),
            t && t._signal("changeEditor", { oldEditor: this }),
            e && e._signal("changeEditor", { editor: this });
        }),
        (this.getSession = function() {
          return this.session;
        }),
        (this.setValue = function(e, t) {
          return (
            this.session.doc.setValue(e),
            t
              ? t == 1
                ? this.navigateFileEnd()
                : t == -1 && this.navigateFileStart()
              : this.selectAll(),
            e
          );
        }),
        (this.getValue = function() {
          return this.session.getValue();
        }),
        (this.getSelection = function() {
          return this.selection;
        }),
        (this.resize = function(e) {
          this.renderer.onResize(e);
        }),
        (this.setTheme = function(e, t) {
          this.renderer.setTheme(e, t);
        }),
        (this.getTheme = function() {
          return this.renderer.getTheme();
        }),
        (this.setStyle = function(e) {
          this.renderer.setStyle(e);
        }),
        (this.unsetStyle = function(e) {
          this.renderer.unsetStyle(e);
        }),
        (this.getFontSize = function() {
          return (
            this.getOption("fontSize") ||
            i.computedStyle(this.container, "fontSize")
          );
        }),
        (this.setFontSize = function(e) {
          this.setOption("fontSize", e);
        }),
        (this.$highlightBrackets = function() {
          this.session.$bracketHighlight &&
            (this.session.removeMarker(this.session.$bracketHighlight),
            (this.session.$bracketHighlight = null));
          if (this.$highlightPending) return;
          var e = this;
          (this.$highlightPending = !0),
            setTimeout(function() {
              e.$highlightPending = !1;
              var t = e.session;
              if (!t || !t.bgTokenizer) return;
              var n = t.findMatchingBracket(e.getCursorPosition());
              if (n) var r = new p(n.row, n.column, n.row, n.column + 1);
              else if (t.$mode.getMatching)
                var r = t.$mode.getMatching(e.session);
              r &&
                (t.$bracketHighlight = t.addMarker(r, "ace_bracket", "text"));
            }, 50);
        }),
        (this.$highlightTags = function() {
          if (this.$highlightTagPending) return;
          var e = this;
          (this.$highlightTagPending = !0),
            setTimeout(function() {
              e.$highlightTagPending = !1;
              var t = e.session;
              if (!t || !t.bgTokenizer) return;
              var n = e.getCursorPosition(),
                r = new y(e.session, n.row, n.column),
                i = r.getCurrentToken();
              if (!i || !/\b(?:tag-open|tag-name)/.test(i.type)) {
                t.removeMarker(t.$tagHighlight), (t.$tagHighlight = null);
                return;
              }
              if (i.type.indexOf("tag-open") != -1) {
                i = r.stepForward();
                if (!i) return;
              }
              var s = i.value,
                o = 0,
                u = r.stepBackward();
              if (u.value == "<") {
                do
                  (u = i),
                    (i = r.stepForward()),
                    i &&
                      i.value === s &&
                      i.type.indexOf("tag-name") !== -1 &&
                      (u.value === "<" ? o++ : u.value === "</" && o--);
                while (i && o >= 0);
              } else {
                do
                  (i = u),
                    (u = r.stepBackward()),
                    i &&
                      i.value === s &&
                      i.type.indexOf("tag-name") !== -1 &&
                      (u.value === "<" ? o++ : u.value === "</" && o--);
                while (u && o <= 0);
                r.stepForward();
              }
              if (!i) {
                t.removeMarker(t.$tagHighlight), (t.$tagHighlight = null);
                return;
              }
              var a = r.getCurrentTokenRow(),
                f = r.getCurrentTokenColumn(),
                l = new p(a, f, a, f + i.value.length);
              t.$tagHighlight &&
                l.compareRange(t.$backMarkers[t.$tagHighlight].range) !== 0 &&
                (t.removeMarker(t.$tagHighlight), (t.$tagHighlight = null)),
                l &&
                  !t.$tagHighlight &&
                  (t.$tagHighlight = t.addMarker(l, "ace_bracket", "text"));
            }, 50);
        }),
        (this.focus = function() {
          var e = this;
          setTimeout(function() {
            e.textInput.focus();
          }),
            this.textInput.focus();
        }),
        (this.isFocused = function() {
          return this.textInput.isFocused();
        }),
        (this.blur = function() {
          this.textInput.blur();
        }),
        (this.onFocus = function(e) {
          if (this.$isFocused) return;
          (this.$isFocused = !0),
            this.renderer.showCursor(),
            this.renderer.visualizeFocus(),
            this._emit("focus", e);
        }),
        (this.onBlur = function(e) {
          if (!this.$isFocused) return;
          (this.$isFocused = !1),
            this.renderer.hideCursor(),
            this.renderer.visualizeBlur(),
            this._emit("blur", e);
        }),
        (this.$cursorChange = function() {
          this.renderer.updateCursor();
        }),
        (this.onDocumentChange = function(e) {
          var t = this.session.$useWrapMode,
            n = e.start.row == e.end.row ? e.end.row : Infinity;
          this.renderer.updateLines(e.start.row, n, t),
            this._signal("change", e),
            this.$cursorChange(),
            this.$updateHighlightActiveLine();
        }),
        (this.onTokenizerUpdate = function(e) {
          var t = e.data;
          this.renderer.updateLines(t.first, t.last);
        }),
        (this.onScrollTopChange = function() {
          this.renderer.scrollToY(this.session.getScrollTop());
        }),
        (this.onScrollLeftChange = function() {
          this.renderer.scrollToX(this.session.getScrollLeft());
        }),
        (this.onCursorChange = function() {
          this.$cursorChange(),
            this.$blockScrolling ||
              (g.warn(
                "Automatically scrolling cursor into view after selection change",
                "this will be disabled in the next version",
                "set editor.$blockScrolling = Infinity to disable this message"
              ),
              this.renderer.scrollCursorIntoView()),
            this.$highlightBrackets(),
            this.$highlightTags(),
            this.$updateHighlightActiveLine(),
            this._signal("changeSelection");
        }),
        (this.$updateHighlightActiveLine = function() {
          var e = this.getSession(),
            t;
          if (this.$highlightActiveLine) {
            if (this.$selectionStyle != "line" || !this.selection.isMultiLine())
              t = this.getCursorPosition();
            this.renderer.$maxLines &&
              this.session.getLength() === 1 &&
              !(this.renderer.$minLines > 1) &&
              (t = !1);
          }
          if (e.$highlightLineMarker && !t)
            e.removeMarker(e.$highlightLineMarker.id),
              (e.$highlightLineMarker = null);
          else if (!e.$highlightLineMarker && t) {
            var n = new p(t.row, t.column, t.row, Infinity);
            (n.id = e.addMarker(n, "ace_active-line", "screenLine")),
              (e.$highlightLineMarker = n);
          } else
            t &&
              ((e.$highlightLineMarker.start.row = t.row),
              (e.$highlightLineMarker.end.row = t.row),
              (e.$highlightLineMarker.start.column = t.column),
              e._signal("changeBackMarker"));
        }),
        (this.onSelectionChange = function(e) {
          var t = this.session;
          t.$selectionMarker && t.removeMarker(t.$selectionMarker),
            (t.$selectionMarker = null);
          if (!this.selection.isEmpty()) {
            var n = this.selection.getRange(),
              r = this.getSelectionStyle();
            t.$selectionMarker = t.addMarker(n, "ace_selection", r);
          } else this.$updateHighlightActiveLine();
          var i =
            this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
          this.session.highlight(i), this._signal("changeSelection");
        }),
        (this.$getSelectionHighLightRegexp = function() {
          var e = this.session,
            t = this.getSelectionRange();
          if (t.isEmpty() || t.isMultiLine()) return;
          var n = t.start.column - 1,
            r = t.end.column + 1,
            i = e.getLine(t.start.row),
            s = i.length,
            o = i.substring(Math.max(n, 0), Math.min(r, s));
          if ((n >= 0 && /^[\w\d]/.test(o)) || (r <= s && /[\w\d]$/.test(o)))
            return;
          o = i.substring(t.start.column, t.end.column);
          if (!/^[\w\d]+$/.test(o)) return;
          var u = this.$search.$assembleRegExp({
            wholeWord: !0,
            caseSensitive: !0,
            needle: o
          });
          return u;
        }),
        (this.onChangeFrontMarker = function() {
          this.renderer.updateFrontMarkers();
        }),
        (this.onChangeBackMarker = function() {
          this.renderer.updateBackMarkers();
        }),
        (this.onChangeBreakpoint = function() {
          this.renderer.updateBreakpoints();
        }),
        (this.onChangeAnnotation = function() {
          this.renderer.setAnnotations(this.session.getAnnotations());
        }),
        (this.onChangeMode = function(e) {
          this.renderer.updateText(), this._emit("changeMode", e);
        }),
        (this.onChangeWrapLimit = function() {
          this.renderer.updateFull();
        }),
        (this.onChangeWrapMode = function() {
          this.renderer.onResize(!0);
        }),
        (this.onChangeFold = function() {
          this.$updateHighlightActiveLine(), this.renderer.updateFull();
        }),
        (this.getSelectedText = function() {
          return this.session.getTextRange(this.getSelectionRange());
        }),
        (this.getCopyText = function() {
          var e = this.getSelectedText();
          return this._signal("copy", e), e;
        }),
        (this.onCopy = function() {
          this.commands.exec("copy", this);
        }),
        (this.onCut = function() {
          this.commands.exec("cut", this);
        }),
        (this.onPaste = function(e, t) {
          var n = { text: e, event: t };
          this.commands.exec("paste", this, n);
        }),
        (this.$handlePaste = function(e) {
          typeof e == "string" && (e = { text: e }), this._signal("paste", e);
          var t = e.text;
          if (!this.inMultiSelectMode || this.inVirtualSelectionMode)
            this.insert(t);
          else {
            var n = t.split(/\r\n|\r|\n/),
              r = this.selection.rangeList.ranges;
            if (n.length > r.length || n.length < 2 || !n[1])
              return this.commands.exec("insertstring", this, t);
            for (var i = r.length; i--; ) {
              var s = r[i];
              s.isEmpty() || this.session.remove(s),
                this.session.insert(s.start, n[i]);
            }
          }
        }),
        (this.execCommand = function(e, t) {
          return this.commands.exec(e, this, t);
        }),
        (this.insert = function(e, t) {
          var n = this.session,
            r = n.getMode(),
            i = this.getCursorPosition();
          if (this.getBehavioursEnabled() && !t) {
            var s = r.transformAction(
              n.getState(i.row),
              "insertion",
              this,
              n,
              e
            );
            s &&
              (e !== s.text &&
                ((this.session.mergeUndoDeltas = !1),
                (this.$mergeNextCommand = !1)),
              (e = s.text));
          }
          e == "	" && (e = this.session.getTabString());
          if (!this.selection.isEmpty()) {
            var o = this.getSelectionRange();
            (i = this.session.remove(o)), this.clearSelection();
          } else if (this.session.getOverwrite()) {
            var o = new p.fromPoints(i, i);
            (o.end.column += e.length), this.session.remove(o);
          }
          if (e == "\n" || e == "\r\n") {
            var u = n.getLine(i.row);
            if (i.column > u.search(/\S|$/)) {
              var a = u.substr(i.column).search(/\S|$/);
              n.doc.removeInLine(i.row, i.column, i.column + a);
            }
          }
          this.clearSelection();
          var f = i.column,
            l = n.getState(i.row),
            u = n.getLine(i.row),
            c = r.checkOutdent(l, u, e),
            h = n.insert(i, e);
          s &&
            s.selection &&
            (s.selection.length == 2
              ? this.selection.setSelectionRange(
                  new p(i.row, f + s.selection[0], i.row, f + s.selection[1])
                )
              : this.selection.setSelectionRange(
                  new p(
                    i.row + s.selection[0],
                    s.selection[1],
                    i.row + s.selection[2],
                    s.selection[3]
                  )
                ));
          if (n.getDocument().isNewLine(e)) {
            var d = r.getNextLineIndent(
              l,
              u.slice(0, i.column),
              n.getTabString()
            );
            n.insert({ row: i.row + 1, column: 0 }, d);
          }
          c && r.autoOutdent(l, n, i.row);
        }),
        (this.onTextInput = function(e) {
          this.keyBinding.onTextInput(e);
        }),
        (this.onCommandKey = function(e, t, n) {
          this.keyBinding.onCommandKey(e, t, n);
        }),
        (this.setOverwrite = function(e) {
          this.session.setOverwrite(e);
        }),
        (this.getOverwrite = function() {
          return this.session.getOverwrite();
        }),
        (this.toggleOverwrite = function() {
          this.session.toggleOverwrite();
        }),
        (this.setScrollSpeed = function(e) {
          this.setOption("scrollSpeed", e);
        }),
        (this.getScrollSpeed = function() {
          return this.getOption("scrollSpeed");
        }),
        (this.setDragDelay = function(e) {
          this.setOption("dragDelay", e);
        }),
        (this.getDragDelay = function() {
          return this.getOption("dragDelay");
        }),
        (this.setSelectionStyle = function(e) {
          this.setOption("selectionStyle", e);
        }),
        (this.getSelectionStyle = function() {
          return this.getOption("selectionStyle");
        }),
        (this.setHighlightActiveLine = function(e) {
          this.setOption("highlightActiveLine", e);
        }),
        (this.getHighlightActiveLine = function() {
          return this.getOption("highlightActiveLine");
        }),
        (this.setHighlightGutterLine = function(e) {
          this.setOption("highlightGutterLine", e);
        }),
        (this.getHighlightGutterLine = function() {
          return this.getOption("highlightGutterLine");
        }),
        (this.setHighlightSelectedWord = function(e) {
          this.setOption("highlightSelectedWord", e);
        }),
        (this.getHighlightSelectedWord = function() {
          return this.$highlightSelectedWord;
        }),
        (this.setAnimatedScroll = function(e) {
          this.renderer.setAnimatedScroll(e);
        }),
        (this.getAnimatedScroll = function() {
          return this.renderer.getAnimatedScroll();
        }),
        (this.setShowInvisibles = function(e) {
          this.renderer.setShowInvisibles(e);
        }),
        (this.getShowInvisibles = function() {
          return this.renderer.getShowInvisibles();
        }),
        (this.setDisplayIndentGuides = function(e) {
          this.renderer.setDisplayIndentGuides(e);
        }),
        (this.getDisplayIndentGuides = function() {
          return this.renderer.getDisplayIndentGuides();
        }),
        (this.setShowPrintMargin = function(e) {
          this.renderer.setShowPrintMargin(e);
        }),
        (this.getShowPrintMargin = function() {
          return this.renderer.getShowPrintMargin();
        }),
        (this.setPrintMarginColumn = function(e) {
          this.renderer.setPrintMarginColumn(e);
        }),
        (this.getPrintMarginColumn = function() {
          return this.renderer.getPrintMarginColumn();
        }),
        (this.setReadOnly = function(e) {
          this.setOption("readOnly", e);
        }),
        (this.getReadOnly = function() {
          return this.getOption("readOnly");
        }),
        (this.setBehavioursEnabled = function(e) {
          this.setOption("behavioursEnabled", e);
        }),
        (this.getBehavioursEnabled = function() {
          return this.getOption("behavioursEnabled");
        }),
        (this.setWrapBehavioursEnabled = function(e) {
          this.setOption("wrapBehavioursEnabled", e);
        }),
        (this.getWrapBehavioursEnabled = function() {
          return this.getOption("wrapBehavioursEnabled");
        }),
        (this.setShowFoldWidgets = function(e) {
          this.setOption("showFoldWidgets", e);
        }),
        (this.getShowFoldWidgets = function() {
          return this.getOption("showFoldWidgets");
        }),
        (this.setFadeFoldWidgets = function(e) {
          this.setOption("fadeFoldWidgets", e);
        }),
        (this.getFadeFoldWidgets = function() {
          return this.getOption("fadeFoldWidgets");
        }),
        (this.remove = function(e) {
          this.selection.isEmpty() &&
            (e == "left"
              ? this.selection.selectLeft()
              : this.selection.selectRight());
          var t = this.getSelectionRange();
          if (this.getBehavioursEnabled()) {
            var n = this.session,
              r = n.getState(t.start.row),
              i = n.getMode().transformAction(r, "deletion", this, n, t);
            if (t.end.column === 0) {
              var s = n.getTextRange(t);
              if (s[s.length - 1] == "\n") {
                var o = n.getLine(t.end.row);
                /^\s+$/.test(o) && (t.end.column = o.length);
              }
            }
            i && (t = i);
          }
          this.session.remove(t), this.clearSelection();
        }),
        (this.removeWordRight = function() {
          this.selection.isEmpty() && this.selection.selectWordRight(),
            this.session.remove(this.getSelectionRange()),
            this.clearSelection();
        }),
        (this.removeWordLeft = function() {
          this.selection.isEmpty() && this.selection.selectWordLeft(),
            this.session.remove(this.getSelectionRange()),
            this.clearSelection();
        }),
        (this.removeToLineStart = function() {
          this.selection.isEmpty() && this.selection.selectLineStart(),
            this.session.remove(this.getSelectionRange()),
            this.clearSelection();
        }),
        (this.removeToLineEnd = function() {
          this.selection.isEmpty() && this.selection.selectLineEnd();
          var e = this.getSelectionRange();
          e.start.column == e.end.column &&
            e.start.row == e.end.row &&
            ((e.end.column = 0), e.end.row++),
            this.session.remove(e),
            this.clearSelection();
        }),
        (this.splitLine = function() {
          this.selection.isEmpty() ||
            (this.session.remove(this.getSelectionRange()),
            this.clearSelection());
          var e = this.getCursorPosition();
          this.insert("\n"), this.moveCursorToPosition(e);
        }),
        (this.transposeLetters = function() {
          if (!this.selection.isEmpty()) return;
          var e = this.getCursorPosition(),
            t = e.column;
          if (t === 0) return;
          var n = this.session.getLine(e.row),
            r,
            i;
          t < n.length
            ? ((r = n.charAt(t) + n.charAt(t - 1)),
              (i = new p(e.row, t - 1, e.row, t + 1)))
            : ((r = n.charAt(t - 1) + n.charAt(t - 2)),
              (i = new p(e.row, t - 2, e.row, t))),
            this.session.replace(i, r);
        }),
        (this.toLowerCase = function() {
          var e = this.getSelectionRange();
          this.selection.isEmpty() && this.selection.selectWord();
          var t = this.getSelectionRange(),
            n = this.session.getTextRange(t);
          this.session.replace(t, n.toLowerCase()),
            this.selection.setSelectionRange(e);
        }),
        (this.toUpperCase = function() {
          var e = this.getSelectionRange();
          this.selection.isEmpty() && this.selection.selectWord();
          var t = this.getSelectionRange(),
            n = this.session.getTextRange(t);
          this.session.replace(t, n.toUpperCase()),
            this.selection.setSelectionRange(e);
        }),
        (this.indent = function() {
          var e = this.session,
            t = this.getSelectionRange();
          if (t.start.row < t.end.row) {
            var n = this.$getSelectedRows();
            e.indentRows(n.first, n.last, "	");
            return;
          }
          if (t.start.column < t.end.column) {
            var r = e.getTextRange(t);
            if (!/^\s+$/.test(r)) {
              var n = this.$getSelectedRows();
              e.indentRows(n.first, n.last, "	");
              return;
            }
          }
          var i = e.getLine(t.start.row),
            o = t.start,
            u = e.getTabSize(),
            a = e.documentToScreenColumn(o.row, o.column);
          if (this.session.getUseSoftTabs())
            var f = u - (a % u),
              l = s.stringRepeat(" ", f);
          else {
            var f = a % u;
            while (i[t.start.column - 1] == " " && f) t.start.column--, f--;
            this.selection.setSelectionRange(t), (l = "	");
          }
          return this.insert(l);
        }),
        (this.blockIndent = function() {
          var e = this.$getSelectedRows();
          this.session.indentRows(e.first, e.last, "	");
        }),
        (this.blockOutdent = function() {
          var e = this.session.getSelection();
          this.session.outdentRows(e.getRange());
        }),
        (this.sortLines = function() {
          var e = this.$getSelectedRows(),
            t = this.session,
            n = [];
          for (i = e.first; i <= e.last; i++) n.push(t.getLine(i));
          n.sort(function(e, t) {
            return e.toLowerCase() < t.toLowerCase()
              ? -1
              : e.toLowerCase() > t.toLowerCase()
              ? 1
              : 0;
          });
          var r = new p(0, 0, 0, 0);
          for (var i = e.first; i <= e.last; i++) {
            var s = t.getLine(i);
            (r.start.row = i),
              (r.end.row = i),
              (r.end.column = s.length),
              t.replace(r, n[i - e.first]);
          }
        }),
        (this.toggleCommentLines = function() {
          var e = this.session.getState(this.getCursorPosition().row),
            t = this.$getSelectedRows();
          this.session
            .getMode()
            .toggleCommentLines(e, this.session, t.first, t.last);
        }),
        (this.toggleBlockComment = function() {
          var e = this.getCursorPosition(),
            t = this.session.getState(e.row),
            n = this.getSelectionRange();
          this.session.getMode().toggleBlockComment(t, this.session, n, e);
        }),
        (this.getNumberAt = function(e, t) {
          var n = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
          n.lastIndex = 0;
          var r = this.session.getLine(e);
          while (n.lastIndex < t) {
            var i = n.exec(r);
            if (i.index <= t && i.index + i[0].length >= t) {
              var s = {
                value: i[0],
                start: i.index,
                end: i.index + i[0].length
              };
              return s;
            }
          }
          return null;
        }),
        (this.modifyNumber = function(e) {
          var t = this.selection.getCursor().row,
            n = this.selection.getCursor().column,
            r = new p(t, n - 1, t, n),
            i = this.session.getTextRange(r);
          if (!isNaN(parseFloat(i)) && isFinite(i)) {
            var s = this.getNumberAt(t, n);
            if (s) {
              var o =
                  s.value.indexOf(".") >= 0
                    ? s.start + s.value.indexOf(".") + 1
                    : s.end,
                u = s.start + s.value.length - o,
                a = parseFloat(s.value);
              (a *= Math.pow(10, u)),
                o !== s.end && n < o
                  ? (e *= Math.pow(10, s.end - n - 1))
                  : (e *= Math.pow(10, s.end - n)),
                (a += e),
                (a /= Math.pow(10, u));
              var f = a.toFixed(u),
                l = new p(t, s.start, t, s.end);
              this.session.replace(l, f),
                this.moveCursorTo(
                  t,
                  Math.max(s.start + 1, n + f.length - s.value.length)
                );
            }
          }
        }),
        (this.removeLines = function() {
          var e = this.$getSelectedRows();
          this.session.removeFullLines(e.first, e.last), this.clearSelection();
        }),
        (this.duplicateSelection = function() {
          var e = this.selection,
            t = this.session,
            n = e.getRange(),
            r = e.isBackwards();
          if (n.isEmpty()) {
            var i = n.start.row;
            t.duplicateLines(i, i);
          } else {
            var s = r ? n.start : n.end,
              o = t.insert(s, t.getTextRange(n), !1);
            (n.start = s), (n.end = o), e.setSelectionRange(n, r);
          }
        }),
        (this.moveLinesDown = function() {
          this.$moveLines(1, !1);
        }),
        (this.moveLinesUp = function() {
          this.$moveLines(-1, !1);
        }),
        (this.moveText = function(e, t, n) {
          return this.session.moveText(e, t, n);
        }),
        (this.copyLinesUp = function() {
          this.$moveLines(-1, !0);
        }),
        (this.copyLinesDown = function() {
          this.$moveLines(1, !0);
        }),
        (this.$moveLines = function(e, t) {
          var n,
            r,
            i = this.selection;
          if (!i.inMultiSelectMode || this.inVirtualSelectionMode) {
            var s = i.toOrientedRange();
            (n = this.$getSelectedRows(s)),
              (r = this.session.$moveLines(n.first, n.last, t ? 0 : e)),
              t && e == -1 && (r = 0),
              s.moveBy(r, 0),
              i.fromOrientedRange(s);
          } else {
            var o = i.rangeList.ranges;
            i.rangeList.detach(this.session),
              (this.inVirtualSelectionMode = !0);
            var u = 0,
              a = 0,
              f = o.length;
            for (var l = 0; l < f; l++) {
              var c = l;
              o[l].moveBy(u, 0), (n = this.$getSelectedRows(o[l]));
              var h = n.first,
                p = n.last;
              while (++l < f) {
                a && o[l].moveBy(a, 0);
                var d = this.$getSelectedRows(o[l]);
                if (t && d.first != p) break;
                if (!t && d.first > p + 1) break;
                p = d.last;
              }
              l--,
                (u = this.session.$moveLines(h, p, t ? 0 : e)),
                t && e == -1 && (c = l + 1);
              while (c <= l) o[c].moveBy(u, 0), c++;
              t || (u = 0), (a += u);
            }
            i.fromOrientedRange(i.ranges[0]),
              i.rangeList.attach(this.session),
              (this.inVirtualSelectionMode = !1);
          }
        }),
        (this.$getSelectedRows = function(e) {
          return (
            (e = (e || this.getSelectionRange()).collapseRows()),
            {
              first: this.session.getRowFoldStart(e.start.row),
              last: this.session.getRowFoldEnd(e.end.row)
            }
          );
        }),
        (this.onCompositionStart = function(e) {
          this.renderer.showComposition(this.getCursorPosition());
        }),
        (this.onCompositionUpdate = function(e) {
          this.renderer.setCompositionText(e);
        }),
        (this.onCompositionEnd = function() {
          this.renderer.hideComposition();
        }),
        (this.getFirstVisibleRow = function() {
          return this.renderer.getFirstVisibleRow();
        }),
        (this.getLastVisibleRow = function() {
          return this.renderer.getLastVisibleRow();
        }),
        (this.isRowVisible = function(e) {
          return (
            e >= this.getFirstVisibleRow() && e <= this.getLastVisibleRow()
          );
        }),
        (this.isRowFullyVisible = function(e) {
          return (
            e >= this.renderer.getFirstFullyVisibleRow() &&
            e <= this.renderer.getLastFullyVisibleRow()
          );
        }),
        (this.$getVisibleRowCount = function() {
          return (
            this.renderer.getScrollBottomRow() -
            this.renderer.getScrollTopRow() +
            1
          );
        }),
        (this.$moveByPage = function(e, t) {
          var n = this.renderer,
            r = this.renderer.layerConfig,
            i = e * Math.floor(r.height / r.lineHeight);
          this.$blockScrolling++,
            t === !0
              ? this.selection.$moveSelection(function() {
                  this.moveCursorBy(i, 0);
                })
              : t === !1 &&
                (this.selection.moveCursorBy(i, 0),
                this.selection.clearSelection()),
            this.$blockScrolling--;
          var s = n.scrollTop;
          n.scrollBy(0, i * r.lineHeight),
            t != null && n.scrollCursorIntoView(null, 0.5),
            n.animateScrolling(s);
        }),
        (this.selectPageDown = function() {
          this.$moveByPage(1, !0);
        }),
        (this.selectPageUp = function() {
          this.$moveByPage(-1, !0);
        }),
        (this.gotoPageDown = function() {
          this.$moveByPage(1, !1);
        }),
        (this.gotoPageUp = function() {
          this.$moveByPage(-1, !1);
        }),
        (this.scrollPageDown = function() {
          this.$moveByPage(1);
        }),
        (this.scrollPageUp = function() {
          this.$moveByPage(-1);
        }),
        (this.scrollToRow = function(e) {
          this.renderer.scrollToRow(e);
        }),
        (this.scrollToLine = function(e, t, n, r) {
          this.renderer.scrollToLine(e, t, n, r);
        }),
        (this.centerSelection = function() {
          var e = this.getSelectionRange(),
            t = {
              row: Math.floor(e.start.row + (e.end.row - e.start.row) / 2),
              column: Math.floor(
                e.start.column + (e.end.column - e.start.column) / 2
              )
            };
          this.renderer.alignCursor(t, 0.5);
        }),
        (this.getCursorPosition = function() {
          return this.selection.getCursor();
        }),
        (this.getCursorPositionScreen = function() {
          return this.session.documentToScreenPosition(
            this.getCursorPosition()
          );
        }),
        (this.getSelectionRange = function() {
          return this.selection.getRange();
        }),
        (this.selectAll = function() {
          (this.$blockScrolling += 1),
            this.selection.selectAll(),
            (this.$blockScrolling -= 1);
        }),
        (this.clearSelection = function() {
          this.selection.clearSelection();
        }),
        (this.moveCursorTo = function(e, t) {
          this.selection.moveCursorTo(e, t);
        }),
        (this.moveCursorToPosition = function(e) {
          this.selection.moveCursorToPosition(e);
        }),
        (this.jumpToMatching = function(e, t) {
          var n = this.getCursorPosition(),
            r = new y(this.session, n.row, n.column),
            i = r.getCurrentToken(),
            s = i || r.stepForward();
          if (!s) return;
          var o,
            u = !1,
            a = {},
            f = n.column - s.start,
            l,
            c = { ")": "(", "(": "(", "]": "[", "[": "[", "{": "{", "}": "{" };
          do {
            if (s.value.match(/[{}()\[\]]/g))
              for (; f < s.value.length && !u; f++) {
                if (!c[s.value[f]]) continue;
                (l = c[s.value[f]] + "." + s.type.replace("rparen", "lparen")),
                  isNaN(a[l]) && (a[l] = 0);
                switch (s.value[f]) {
                  case "(":
                  case "[":
                  case "{":
                    a[l]++;
                    break;
                  case ")":
                  case "]":
                  case "}":
                    a[l]--, a[l] === -1 && ((o = "bracket"), (u = !0));
                }
              }
            else
              s &&
                s.type.indexOf("tag-name") !== -1 &&
                (isNaN(a[s.value]) && (a[s.value] = 0),
                i.value === "<"
                  ? a[s.value]++
                  : i.value === "</" && a[s.value]--,
                a[s.value] === -1 && ((o = "tag"), (u = !0)));
            u || ((i = s), (s = r.stepForward()), (f = 0));
          } while (s && !u);
          if (!o) return;
          var h, d;
          if (o === "bracket") {
            h = this.session.getBracketRange(n);
            if (!h) {
              (h = new p(
                r.getCurrentTokenRow(),
                r.getCurrentTokenColumn() + f - 1,
                r.getCurrentTokenRow(),
                r.getCurrentTokenColumn() + f - 1
              )),
                (d = h.start);
              if (t || (d.row === n.row && Math.abs(d.column - n.column) < 2))
                h = this.session.getBracketRange(d);
            }
          } else if (o === "tag") {
            if (!s || s.type.indexOf("tag-name") === -1) return;
            var v = s.value;
            h = new p(
              r.getCurrentTokenRow(),
              r.getCurrentTokenColumn() - 2,
              r.getCurrentTokenRow(),
              r.getCurrentTokenColumn() - 2
            );
            if (h.compare(n.row, n.column) === 0) {
              u = !1;
              do
                (s = i),
                  (i = r.stepBackward()),
                  i &&
                    (i.type.indexOf("tag-close") !== -1 &&
                      h.setEnd(
                        r.getCurrentTokenRow(),
                        r.getCurrentTokenColumn() + 1
                      ),
                    s.value === v &&
                      s.type.indexOf("tag-name") !== -1 &&
                      (i.value === "<" ? a[v]++ : i.value === "</" && a[v]--,
                      a[v] === 0 && (u = !0)));
              while (i && !u);
            }
            s &&
              s.type.indexOf("tag-name") &&
              ((d = h.start),
              d.row == n.row &&
                Math.abs(d.column - n.column) < 2 &&
                (d = h.end));
          }
          (d = (h && h.cursor) || d),
            d &&
              (e
                ? h && t
                  ? this.selection.setRange(h)
                  : h && h.isEqual(this.getSelectionRange())
                  ? this.clearSelection()
                  : this.selection.selectTo(d.row, d.column)
                : this.selection.moveTo(d.row, d.column));
        }),
        (this.gotoLine = function(e, t, n) {
          this.selection.clearSelection(),
            this.session.unfold({ row: e - 1, column: t || 0 }),
            (this.$blockScrolling += 1),
            this.exitMultiSelectMode && this.exitMultiSelectMode(),
            this.moveCursorTo(e - 1, t || 0),
            (this.$blockScrolling -= 1),
            this.isRowFullyVisible(e - 1) || this.scrollToLine(e - 1, !0, n);
        }),
        (this.navigateTo = function(e, t) {
          this.selection.moveTo(e, t);
        }),
        (this.navigateUp = function(e) {
          if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
            var t = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(t);
          }
          this.selection.clearSelection(),
            this.selection.moveCursorBy(-e || -1, 0);
        }),
        (this.navigateDown = function(e) {
          if (this.selection.isMultiLine() && this.selection.isBackwards()) {
            var t = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(t);
          }
          this.selection.clearSelection(),
            this.selection.moveCursorBy(e || 1, 0);
        }),
        (this.navigateLeft = function(e) {
          if (!this.selection.isEmpty()) {
            var t = this.getSelectionRange().start;
            this.moveCursorToPosition(t);
          } else {
            e = e || 1;
            while (e--) this.selection.moveCursorLeft();
          }
          this.clearSelection();
        }),
        (this.navigateRight = function(e) {
          if (!this.selection.isEmpty()) {
            var t = this.getSelectionRange().end;
            this.moveCursorToPosition(t);
          } else {
            e = e || 1;
            while (e--) this.selection.moveCursorRight();
          }
          this.clearSelection();
        }),
        (this.navigateLineStart = function() {
          this.selection.moveCursorLineStart(), this.clearSelection();
        }),
        (this.navigateLineEnd = function() {
          this.selection.moveCursorLineEnd(), this.clearSelection();
        }),
        (this.navigateFileEnd = function() {
          this.selection.moveCursorFileEnd(), this.clearSelection();
        }),
        (this.navigateFileStart = function() {
          this.selection.moveCursorFileStart(), this.clearSelection();
        }),
        (this.navigateWordRight = function() {
          this.selection.moveCursorWordRight(), this.clearSelection();
        }),
        (this.navigateWordLeft = function() {
          this.selection.moveCursorWordLeft(), this.clearSelection();
        }),
        (this.replace = function(e, t) {
          t && this.$search.set(t);
          var n = this.$search.find(this.session),
            r = 0;
          return n
            ? (this.$tryReplace(n, e) && (r = 1),
              n !== null &&
                (this.selection.setSelectionRange(n),
                this.renderer.scrollSelectionIntoView(n.start, n.end)),
              r)
            : r;
        }),
        (this.replaceAll = function(e, t) {
          t && this.$search.set(t);
          var n = this.$search.findAll(this.session),
            r = 0;
          if (!n.length) return r;
          this.$blockScrolling += 1;
          var i = this.getSelectionRange();
          this.selection.moveTo(0, 0);
          for (var s = n.length - 1; s >= 0; --s)
            this.$tryReplace(n[s], e) && r++;
          return (
            this.selection.setSelectionRange(i), (this.$blockScrolling -= 1), r
          );
        }),
        (this.$tryReplace = function(e, t) {
          var n = this.session.getTextRange(e);
          return (
            (t = this.$search.replace(n, t)),
            t !== null ? ((e.end = this.session.replace(e, t)), e) : null
          );
        }),
        (this.getLastSearchOptions = function() {
          return this.$search.getOptions();
        }),
        (this.find = function(e, t, n) {
          t || (t = {}),
            typeof e == "string" || e instanceof RegExp
              ? (t.needle = e)
              : typeof e == "object" && r.mixin(t, e);
          var i = this.selection.getRange();
          t.needle == null &&
            ((e = this.session.getTextRange(i) || this.$search.$options.needle),
            e ||
              ((i = this.session.getWordRange(i.start.row, i.start.column)),
              (e = this.session.getTextRange(i))),
            this.$search.set({ needle: e })),
            this.$search.set(t),
            t.start || this.$search.set({ start: i });
          var s = this.$search.find(this.session);
          if (t.preventScroll) return s;
          if (s) return this.revealRange(s, n), s;
          t.backwards ? (i.start = i.end) : (i.end = i.start),
            this.selection.setRange(i);
        }),
        (this.findNext = function(e, t) {
          this.find({ skipCurrent: !0, backwards: !1 }, e, t);
        }),
        (this.findPrevious = function(e, t) {
          this.find(e, { skipCurrent: !0, backwards: !0 }, t);
        }),
        (this.revealRange = function(e, t) {
          (this.$blockScrolling += 1),
            this.session.unfold(e),
            this.selection.setSelectionRange(e),
            (this.$blockScrolling -= 1);
          var n = this.renderer.scrollTop;
          this.renderer.scrollSelectionIntoView(e.start, e.end, 0.5),
            t !== !1 && this.renderer.animateScrolling(n);
        }),
        (this.undo = function() {
          this.$blockScrolling++,
            this.session.getUndoManager().undo(),
            this.$blockScrolling--,
            this.renderer.scrollCursorIntoView(null, 0.5);
        }),
        (this.redo = function() {
          this.$blockScrolling++,
            this.session.getUndoManager().redo(),
            this.$blockScrolling--,
            this.renderer.scrollCursorIntoView(null, 0.5);
        }),
        (this.destroy = function() {
          this.renderer.destroy(),
            this._signal("destroy", this),
            this.session && this.session.destroy();
        }),
        (this.setAutoScrollEditorIntoView = function(e) {
          if (!e) return;
          var t,
            n = this,
            r = !1;
          this.$scrollAnchor ||
            (this.$scrollAnchor = document.createElement("div"));
          var i = this.$scrollAnchor;
          (i.style.cssText = "position:absolute"),
            this.container.insertBefore(i, this.container.firstChild);
          var s = this.on("changeSelection", function() {
              r = !0;
            }),
            o = this.renderer.on("beforeRender", function() {
              r && (t = n.renderer.container.getBoundingClientRect());
            }),
            u = this.renderer.on("afterRender", function() {
              if (
                r &&
                t &&
                (n.isFocused() || (n.searchBox && n.searchBox.isFocused()))
              ) {
                var e = n.renderer,
                  s = e.$cursorLayer.$pixelPos,
                  o = e.layerConfig,
                  u = s.top - o.offset;
                s.top >= 0 && u + t.top < 0
                  ? (r = !0)
                  : s.top < o.height &&
                    s.top + t.top + o.lineHeight > window.innerHeight
                  ? (r = !1)
                  : (r = null),
                  r != null &&
                    ((i.style.top = u + "px"),
                    (i.style.left = s.left + "px"),
                    (i.style.height = o.lineHeight + "px"),
                    i.scrollIntoView(r)),
                  (r = t = null);
              }
            });
          this.setAutoScrollEditorIntoView = function(e) {
            if (e) return;
            delete this.setAutoScrollEditorIntoView,
              this.off("changeSelection", s),
              this.renderer.off("afterRender", u),
              this.renderer.off("beforeRender", o);
          };
        }),
        (this.$resetCursorStyle = function() {
          var e = this.$cursorStyle || "ace",
            t = this.renderer.$cursorLayer;
          if (!t) return;
          t.setSmoothBlinking(/smooth/.test(e)),
            (t.isBlinking = !this.$readOnly && e != "wide"),
            i.setCssClass(t.element, "ace_slim-cursors", /slim/.test(e));
        });
    }.call(b.prototype),
      g.defineOptions(b.prototype, "editor", {
        selectionStyle: {
          set: function(e) {
            this.onSelectionChange(),
              this._signal("changeSelectionStyle", { data: e });
          },
          initialValue: "line"
        },
        highlightActiveLine: {
          set: function() {
            this.$updateHighlightActiveLine();
          },
          initialValue: !0
        },
        highlightSelectedWord: {
          set: function(e) {
            this.$onSelectionChange();
          },
          initialValue: !0
        },
        readOnly: {
          set: function(e) {
            this.$resetCursorStyle();
          },
          initialValue: !1
        },
        cursorStyle: {
          set: function(e) {
            this.$resetCursorStyle();
          },
          values: ["ace", "slim", "smooth", "wide"],
          initialValue: "ace"
        },
        mergeUndoDeltas: { values: [!1, !0, "always"], initialValue: !0 },
        behavioursEnabled: { initialValue: !0 },
        wrapBehavioursEnabled: { initialValue: !0 },
        autoScrollEditorIntoView: {
          set: function(e) {
            this.setAutoScrollEditorIntoView(e);
          }
        },
        keyboardHandler: {
          set: function(e) {
            this.setKeyboardHandler(e);
          },
          get: function() {
            return this.keybindingId;
          },
          handlesSet: !0
        },
        hScrollBarAlwaysVisible: "renderer",
        vScrollBarAlwaysVisible: "renderer",
        highlightGutterLine: "renderer",
        animatedScroll: "renderer",
        showInvisibles: "renderer",
        showPrintMargin: "renderer",
        printMarginColumn: "renderer",
        printMargin: "renderer",
        fadeFoldWidgets: "renderer",
        showFoldWidgets: "renderer",
        showLineNumbers: "renderer",
        showGutter: "renderer",
        displayIndentGuides: "renderer",
        fontSize: "renderer",
        fontFamily: "renderer",
        maxLines: "renderer",
        minLines: "renderer",
        scrollPastEnd: "renderer",
        fixedWidthGutter: "renderer",
        theme: "renderer",
        scrollSpeed: "$mouseHandler",
        dragDelay: "$mouseHandler",
        dragEnabled: "$mouseHandler",
        focusTimout: "$mouseHandler",
        tooltipFollowsMouse: "$mouseHandler",
        firstLineNumber: "session",
        overwrite: "session",
        newLineMode: "session",
        useWorker: "session",
        useSoftTabs: "session",
        tabSize: "session",
        wrap: "session",
        indentedSoftWrap: "session",
        foldStyle: "session",
        mode: "session"
      }),
      (t.Editor = b));
  }),

}
