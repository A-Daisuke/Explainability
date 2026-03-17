function __method_wrapper__() {
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

}
