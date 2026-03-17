function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    function u(e) {
      e.$clickSelection = null;
      var t = e.editor;
      t.setDefaultHandler("mousedown", this.onMouseDown.bind(e)),
        t.setDefaultHandler("dblclick", this.onDoubleClick.bind(e)),
        t.setDefaultHandler("tripleclick", this.onTripleClick.bind(e)),
        t.setDefaultHandler("quadclick", this.onQuadClick.bind(e)),
        t.setDefaultHandler("mousewheel", this.onMouseWheel.bind(e)),
        t.setDefaultHandler("touchmove", this.onTouchMove.bind(e));
      var n = [
        "select",
        "startSelect",
        "selectEnd",
        "selectAllEnd",
        "selectByWordsEnd",
        "selectByLinesEnd",
        "dragWait",
        "dragWaitEnd",
        "focusWait"
      ];
      n.forEach(function(t) {
        e[t] = this[t];
      }, this),
        (e.selectByLines = this.extendSelectionBy.bind(e, "getLineRange")),
        (e.selectByWords = this.extendSelectionBy.bind(e, "getWordRange"));
    }
    function a(e, t, n, r) {
      return Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - t, 2));
    }
    function f(e, t) {
      if (e.start.row == e.end.row)
        var n = 2 * t.column - e.start.column - e.end.column;
      else if (e.start.row == e.end.row - 1 && !e.start.column && !e.end.column)
        var n = t.column - 4;
      else var n = 2 * t.row - e.start.row - e.end.row;
      return n < 0
        ? { cursor: e.start, anchor: e.end }
        : { cursor: e.end, anchor: e.start };
    }
    var r = e("../lib/dom"),
      i = e("../lib/event"),
      s = e("../lib/useragent"),
      o = 0;
    (function() {
      (this.onMouseDown = function(e) {
        var t = e.inSelection(),
          n = e.getDocumentPosition();
        this.mousedownEvent = e;
        var r = this.editor,
          i = e.getButton();
        if (i !== 0) {
          var s = r.getSelectionRange(),
            o = s.isEmpty();
          r.$blockScrolling++,
            (o || i == 1) && r.selection.moveToPosition(n),
            r.$blockScrolling--,
            i == 2 && r.textInput.onContextMenu(e.domEvent);
          return;
        }
        this.mousedownEvent.time = Date.now();
        if (t && !r.isFocused()) {
          r.focus();
          if (
            this.$focusTimout &&
            !this.$clickSelection &&
            !r.inMultiSelectMode
          ) {
            this.setState("focusWait"), this.captureMouse(e);
            return;
          }
        }
        return (
          this.captureMouse(e),
          this.startSelect(n, e.domEvent._clicks > 1),
          e.preventDefault()
        );
      }),
        (this.startSelect = function(e, t) {
          e = e || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
          var n = this.editor;
          n.$blockScrolling++,
            this.mousedownEvent.getShiftKey()
              ? n.selection.selectToPosition(e)
              : t || n.selection.moveToPosition(e),
            t || this.select(),
            n.renderer.scroller.setCapture && n.renderer.scroller.setCapture(),
            n.setStyle("ace_selecting"),
            this.setState("select"),
            n.$blockScrolling--;
        }),
        (this.select = function() {
          var e,
            t = this.editor,
            n = t.renderer.screenToTextCoordinates(this.x, this.y);
          t.$blockScrolling++;
          if (this.$clickSelection) {
            var r = this.$clickSelection.comparePoint(n);
            if (r == -1) e = this.$clickSelection.end;
            else if (r == 1) e = this.$clickSelection.start;
            else {
              var i = f(this.$clickSelection, n);
              (n = i.cursor), (e = i.anchor);
            }
            t.selection.setSelectionAnchor(e.row, e.column);
          }
          t.selection.selectToPosition(n),
            t.$blockScrolling--,
            t.renderer.scrollCursorIntoView();
        }),
        (this.extendSelectionBy = function(e) {
          var t,
            n = this.editor,
            r = n.renderer.screenToTextCoordinates(this.x, this.y),
            i = n.selection[e](r.row, r.column);
          n.$blockScrolling++;
          if (this.$clickSelection) {
            var s = this.$clickSelection.comparePoint(i.start),
              o = this.$clickSelection.comparePoint(i.end);
            if (s == -1 && o <= 0) {
              t = this.$clickSelection.end;
              if (i.end.row != r.row || i.end.column != r.column) r = i.start;
            } else if (o == 1 && s >= 0) {
              t = this.$clickSelection.start;
              if (i.start.row != r.row || i.start.column != r.column) r = i.end;
            } else if (s == -1 && o == 1) (r = i.end), (t = i.start);
            else {
              var u = f(this.$clickSelection, r);
              (r = u.cursor), (t = u.anchor);
            }
            n.selection.setSelectionAnchor(t.row, t.column);
          }
          n.selection.selectToPosition(r),
            n.$blockScrolling--,
            n.renderer.scrollCursorIntoView();
        }),
        (this.selectEnd = this.selectAllEnd = this.selectByWordsEnd = this.selectByLinesEnd = function() {
          (this.$clickSelection = null),
            this.editor.unsetStyle("ace_selecting"),
            this.editor.renderer.scroller.releaseCapture &&
              this.editor.renderer.scroller.releaseCapture();
        }),
        (this.focusWait = function() {
          var e = a(
              this.mousedownEvent.x,
              this.mousedownEvent.y,
              this.x,
              this.y
            ),
            t = Date.now();
          (e > o || t - this.mousedownEvent.time > this.$focusTimout) &&
            this.startSelect(this.mousedownEvent.getDocumentPosition());
        }),
        (this.onDoubleClick = function(e) {
          var t = e.getDocumentPosition(),
            n = this.editor,
            r = n.session,
            i = r.getBracketRange(t);
          i
            ? (i.isEmpty() && (i.start.column--, i.end.column++),
              this.setState("select"))
            : ((i = n.selection.getWordRange(t.row, t.column)),
              this.setState("selectByWords")),
            (this.$clickSelection = i),
            this.select();
        }),
        (this.onTripleClick = function(e) {
          var t = e.getDocumentPosition(),
            n = this.editor;
          this.setState("selectByLines");
          var r = n.getSelectionRange();
          r.isMultiLine() && r.contains(t.row, t.column)
            ? ((this.$clickSelection = n.selection.getLineRange(r.start.row)),
              (this.$clickSelection.end = n.selection.getLineRange(
                r.end.row
              ).end))
            : (this.$clickSelection = n.selection.getLineRange(t.row)),
            this.select();
        }),
        (this.onQuadClick = function(e) {
          var t = this.editor;
          t.selectAll(),
            (this.$clickSelection = t.getSelectionRange()),
            this.setState("selectAll");
        }),
        (this.onMouseWheel = function(e) {
          if (e.getAccelKey()) return;
          e.getShiftKey() &&
            e.wheelY &&
            !e.wheelX &&
            ((e.wheelX = e.wheelY), (e.wheelY = 0));
          var t = e.domEvent.timeStamp,
            n = t - (this.$lastScrollTime || 0),
            r = this.editor,
            i = r.renderer.isScrollableBy(
              e.wheelX * e.speed,
              e.wheelY * e.speed
            );
          if (i || n < 200)
            return (
              (this.$lastScrollTime = t),
              r.renderer.scrollBy(e.wheelX * e.speed, e.wheelY * e.speed),
              e.stop()
            );
        }),
        (this.onTouchMove = function(e) {
          var t = e.domEvent.timeStamp,
            n = t - (this.$lastScrollTime || 0),
            r = this.editor,
            i = r.renderer.isScrollableBy(
              e.wheelX * e.speed,
              e.wheelY * e.speed
            );
          if (i || n < 200)
            return (
              (this.$lastScrollTime = t),
              r.renderer.scrollBy(e.wheelX * e.speed, e.wheelY * e.speed),
              e.stop()
            );
        });
    }.call(u.prototype),
      (t.DefaultHandlers = u));
  }),

}
