function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./range").Range,
      i = e("./lib/event_emitter").EventEmitter,
      s = e("./lib/oop"),
      o = function(e, t, n, r, i, s) {
        var o = this;
        (this.length = t),
          (this.session = e),
          (this.doc = e.getDocument()),
          (this.mainClass = i),
          (this.othersClass = s),
          (this.$onUpdate = this.onUpdate.bind(this)),
          this.doc.on("change", this.$onUpdate),
          (this.$others = r),
          (this.$onCursorChange = function() {
            setTimeout(function() {
              o.onCursorChange();
            });
          }),
          (this.$pos = n);
        var u = e.getUndoManager().$undoStack ||
          e.getUndoManager().$undostack || { length: -1 };
        (this.$undoStackDepth = u.length),
          this.setup(),
          e.selection.on("changeCursor", this.$onCursorChange);
      };
    (function() {
      s.implement(this, i),
        (this.setup = function() {
          var e = this,
            t = this.doc,
            n = this.session;
          (this.selectionBefore = n.selection.toJSON()),
            n.selection.inMultiSelectMode && n.selection.toSingleRange(),
            (this.pos = t.createAnchor(this.$pos.row, this.$pos.column));
          var i = this.pos;
          (i.$insertRight = !0),
            i.detach(),
            (i.markerId = n.addMarker(
              new r(i.row, i.column, i.row, i.column + this.length),
              this.mainClass,
              null,
              !1
            )),
            (this.others = []),
            this.$others.forEach(function(n) {
              var r = t.createAnchor(n.row, n.column);
              (r.$insertRight = !0), r.detach(), e.others.push(r);
            }),
            n.setUndoSelect(!1);
        }),
        (this.showOtherMarkers = function() {
          if (this.othersActive) return;
          var e = this.session,
            t = this;
          (this.othersActive = !0),
            this.others.forEach(function(n) {
              n.markerId = e.addMarker(
                new r(n.row, n.column, n.row, n.column + t.length),
                t.othersClass,
                null,
                !1
              );
            });
        }),
        (this.hideOtherMarkers = function() {
          if (!this.othersActive) return;
          this.othersActive = !1;
          for (var e = 0; e < this.others.length; e++)
            this.session.removeMarker(this.others[e].markerId);
        }),
        (this.onUpdate = function(e) {
          if (this.$updating) return this.updateAnchors(e);
          var t = e;
          if (t.start.row !== t.end.row) return;
          if (t.start.row !== this.pos.row) return;
          this.$updating = !0;
          var n =
              e.action === "insert"
                ? t.end.column - t.start.column
                : t.start.column - t.end.column,
            i =
              t.start.column >= this.pos.column &&
              t.start.column <= this.pos.column + this.length + 1,
            s = t.start.column - this.pos.column;
          this.updateAnchors(e), i && (this.length += n);
          if (i && !this.session.$fromUndo)
            if (e.action === "insert")
              for (var o = this.others.length - 1; o >= 0; o--) {
                var u = this.others[o],
                  a = { row: u.row, column: u.column + s };
                this.doc.insertMergedLines(a, e.lines);
              }
            else if (e.action === "remove")
              for (var o = this.others.length - 1; o >= 0; o--) {
                var u = this.others[o],
                  a = { row: u.row, column: u.column + s };
                this.doc.remove(new r(a.row, a.column, a.row, a.column - n));
              }
          (this.$updating = !1), this.updateMarkers();
        }),
        (this.updateAnchors = function(e) {
          this.pos.onChange(e);
          for (var t = this.others.length; t--; ) this.others[t].onChange(e);
          this.updateMarkers();
        }),
        (this.updateMarkers = function() {
          if (this.$updating) return;
          var e = this,
            t = this.session,
            n = function(n, i) {
              t.removeMarker(n.markerId),
                (n.markerId = t.addMarker(
                  new r(n.row, n.column, n.row, n.column + e.length),
                  i,
                  null,
                  !1
                ));
            };
          n(this.pos, this.mainClass);
          for (var i = this.others.length; i--; )
            n(this.others[i], this.othersClass);
        }),
        (this.onCursorChange = function(e) {
          if (this.$updating || !this.session) return;
          var t = this.session.selection.getCursor();
          t.row === this.pos.row &&
          t.column >= this.pos.column &&
          t.column <= this.pos.column + this.length
            ? (this.showOtherMarkers(), this._emit("cursorEnter", e))
            : (this.hideOtherMarkers(), this._emit("cursorLeave", e));
        }),
        (this.detach = function() {
          this.session.removeMarker(this.pos && this.pos.markerId),
            this.hideOtherMarkers(),
            this.doc.removeEventListener("change", this.$onUpdate),
            this.session.selection.removeEventListener(
              "changeCursor",
              this.$onCursorChange
            ),
            this.session.setUndoSelect(!0),
            (this.session = null);
        }),
        (this.cancel = function() {
          if (this.$undoStackDepth === -1) return;
          var e = this.session.getUndoManager(),
            t = (e.$undoStack || e.$undostack).length - this.$undoStackDepth;
          for (var n = 0; n < t; n++) e.undo(!0);
          this.selectionBefore &&
            this.session.selection.fromJSON(this.selectionBefore);
        });
    }.call(o.prototype),
      (t.PlaceHolder = o));
  }),

}
