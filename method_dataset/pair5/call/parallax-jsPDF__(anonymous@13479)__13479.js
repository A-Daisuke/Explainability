function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      i = e("../lib/net"),
      s = e("../lib/event_emitter").EventEmitter,
      o = e("../config"),
      u = function(t, n, r, i) {
        (this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this)),
          (this.changeListener = this.changeListener.bind(this)),
          (this.onMessage = this.onMessage.bind(this)),
          e.nameToUrl && !e.toUrl && (e.toUrl = e.nameToUrl);
        if (o.get("packaged") || !e.toUrl) i = i || o.moduleUrl(n, "worker");
        else {
          var s = this.$normalizePath;
          i = i || s(e.toUrl("ace/worker/worker.js", null, "_"));
          var u = {};
          t.forEach(function(t) {
            u[t] = s(e.toUrl(t, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
          });
        }
        try {
          this.$worker = new Worker(i);
        } catch (a) {
          if (!(a instanceof window.DOMException)) throw a;
          var f = this.$workerBlob(i),
            l = window.URL || window.webkitURL,
            c = l.createObjectURL(f);
          (this.$worker = new Worker(c)), l.revokeObjectURL(c);
        }
        this.$worker.postMessage({
          init: !0,
          tlns: u,
          module: n,
          classname: r
        }),
          (this.callbackId = 1),
          (this.callbacks = {}),
          (this.$worker.onmessage = this.onMessage);
      };
    (function() {
      r.implement(this, s),
        (this.onMessage = function(e) {
          var t = e.data;
          switch (t.type) {
            case "event":
              this._signal(t.name, { data: t.data });
              break;
            case "call":
              var n = this.callbacks[t.id];
              n && (n(t.data), delete this.callbacks[t.id]);
              break;
            case "error":
              this.reportError(t.data);
              break;
            case "log":
              window.console &&
                console.log &&
                console.log.apply(console, t.data);
          }
        }),
        (this.reportError = function(e) {
          window.console && console.error && console.error(e);
        }),
        (this.$normalizePath = function(e) {
          return i.qualifyURL(e);
        }),
        (this.terminate = function() {
          this._signal("terminate", {}),
            (this.deltaQueue = null),
            this.$worker.terminate(),
            (this.$worker = null),
            this.$doc && this.$doc.off("change", this.changeListener),
            (this.$doc = null);
        }),
        (this.send = function(e, t) {
          this.$worker.postMessage({ command: e, args: t });
        }),
        (this.call = function(e, t, n) {
          if (n) {
            var r = this.callbackId++;
            (this.callbacks[r] = n), t.push(r);
          }
          this.send(e, t);
        }),
        (this.emit = function(e, t) {
          try {
            this.$worker.postMessage({ event: e, data: { data: t.data } });
          } catch (n) {
            console.error(n.stack);
          }
        }),
        (this.attachToDocument = function(e) {
          this.$doc && this.terminate(),
            (this.$doc = e),
            this.call("setValue", [e.getValue()]),
            e.on("change", this.changeListener);
        }),
        (this.changeListener = function(e) {
          this.deltaQueue ||
            ((this.deltaQueue = []), setTimeout(this.$sendDeltaQueue, 0)),
            e.action == "insert"
              ? this.deltaQueue.push(e.start, e.lines)
              : this.deltaQueue.push(e.start, e.end);
        }),
        (this.$sendDeltaQueue = function() {
          var e = this.deltaQueue;
          if (!e) return;
          (this.deltaQueue = null),
            e.length > 50 && e.length > this.$doc.getLength() >> 1
              ? this.call("setValue", [this.$doc.getValue()])
              : this.emit("change", { data: e });
        }),
        (this.$workerBlob = function(e) {
          var t = "importScripts('" + i.qualifyURL(e) + "');";
          try {
            return new Blob([t], { type: "application/javascript" });
          } catch (n) {
            var r =
                window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder,
              s = new r();
            return s.append(t), s.getBlob("application/javascript");
          }
        });
    }.call(u.prototype));
    var a = function(e, t, n) {
      (this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this)),
        (this.changeListener = this.changeListener.bind(this)),
        (this.callbackId = 1),
        (this.callbacks = {}),
        (this.messageBuffer = []);
      var r = null,
        i = !1,
        u = Object.create(s),
        a = this;
      (this.$worker = {}),
        (this.$worker.terminate = function() {}),
        (this.$worker.postMessage = function(e) {
          a.messageBuffer.push(e), r && (i ? setTimeout(f) : f());
        }),
        (this.setEmitSync = function(e) {
          i = e;
        });
      var f = function() {
        var e = a.messageBuffer.shift();
        e.command
          ? r[e.command].apply(r, e.args)
          : e.event && u._signal(e.event, e.data);
      };
      (u.postMessage = function(e) {
        a.onMessage({ data: e });
      }),
        (u.callback = function(e, t) {
          this.postMessage({ type: "call", id: t, data: e });
        }),
        (u.emit = function(e, t) {
          this.postMessage({ type: "event", name: e, data: t });
        }),
        o.loadModule(["worker", t], function(e) {
          r = new e[n](u);
          while (a.messageBuffer.length) f();
        });
    };
    (a.prototype = u.prototype), (t.UIWorkerClient = a), (t.WorkerClient = u);
  }),

}
