function __method_wrapper__() {
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

}
