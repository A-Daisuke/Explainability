function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      i = e("./lib/dom"),
      s = e("./config"),
      o = e("./lib/useragent"),
      u = e("./layer/gutter").Gutter,
      a = e("./layer/marker").Marker,
      f = e("./layer/text").Text,
      l = e("./layer/cursor").Cursor,
      c = e("./scrollbar").HScrollBar,
      h = e("./scrollbar").VScrollBar,
      p = e("./renderloop").RenderLoop,
      d = e("./layer/font_metrics").FontMetrics,
      v = e("./lib/event_emitter").EventEmitter,
      m =
        '.ace_editor {position: relative;overflow: hidden;font: 12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace;direction: ltr;text-align: left;}.ace_scroller {position: absolute;overflow: hidden;top: 0;bottom: 0;background-color: inherit;-ms-user-select: none;-moz-user-select: none;-webkit-user-select: none;user-select: none;cursor: text;}.ace_content {position: absolute;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;min-width: 100%;}.ace_dragging .ace_scroller:before{position: absolute;top: 0;left: 0;right: 0;bottom: 0;content: \'\';background: rgba(250, 250, 250, 0.01);z-index: 1000;}.ace_dragging.ace_dark .ace_scroller:before{background: rgba(0, 0, 0, 0.01);}.ace_selecting, .ace_selecting * {cursor: text !important;}.ace_gutter {position: absolute;overflow : hidden;width: auto;top: 0;bottom: 0;left: 0;cursor: default;z-index: 4;-ms-user-select: none;-moz-user-select: none;-webkit-user-select: none;user-select: none;}.ace_gutter-active-line {position: absolute;left: 0;right: 0;}.ace_scroller.ace_scroll-left {box-shadow: 17px 0 16px -16px rgba(0, 0, 0, 0.4) inset;}.ace_gutter-cell {padding-left: 19px;padding-right: 6px;background-repeat: no-repeat;}.ace_gutter-cell.ace_error {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==");background-repeat: no-repeat;background-position: 2px center;}.ace_gutter-cell.ace_warning {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==");background-position: 2px center;}.ace_gutter-cell.ace_info {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAJ0Uk5TAAB2k804AAAAPklEQVQY02NgIB68QuO3tiLznjAwpKTgNyDbMegwisCHZUETUZV0ZqOquBpXj2rtnpSJT1AEnnRmL2OgGgAAIKkRQap2htgAAAAASUVORK5CYII=");background-position: 2px center;}.ace_dark .ace_gutter-cell.ace_info {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAChoaGAgIAqKiq+vr6tra1ZWVmUlJSbm5s8PDxubm56enrdgzg3AAAAAXRSTlMAQObYZgAAAClJREFUeNpjYMAPdsMYHegyJZFQBlsUlMFVCWUYKkAZMxZAGdxlDMQBAG+TBP4B6RyJAAAAAElFTkSuQmCC");}.ace_scrollbar {position: absolute;right: 0;bottom: 0;z-index: 6;}.ace_scrollbar-inner {position: absolute;cursor: text;left: 0;top: 0;}.ace_scrollbar-v{overflow-x: hidden;overflow-y: scroll;top: 0;}.ace_scrollbar-h {overflow-x: scroll;overflow-y: hidden;left: 0;}.ace_print-margin {position: absolute;height: 100%;}.ace_text-input {position: absolute;z-index: 0;width: 0.5em;height: 1em;opacity: 0;background: transparent;-moz-appearance: none;appearance: none;border: none;resize: none;outline: none;overflow: hidden;font: inherit;padding: 0 1px;margin: 0 -1px;text-indent: -1em;-ms-user-select: text;-moz-user-select: text;-webkit-user-select: text;user-select: text;white-space: pre!important;}.ace_text-input.ace_composition {background: inherit;color: inherit;z-index: 1000;opacity: 1;text-indent: 0;}.ace_layer {z-index: 1;position: absolute;overflow: hidden;word-wrap: normal;white-space: pre;height: 100%;width: 100%;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;pointer-events: none;}.ace_gutter-layer {position: relative;width: auto;text-align: right;pointer-events: auto;}.ace_text-layer {font: inherit !important;}.ace_cjk {display: inline-block;text-align: center;}.ace_cursor-layer {z-index: 4;}.ace_cursor {z-index: 4;position: absolute;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;border-left: 2px solid;transform: translatez(0);}.ace_slim-cursors .ace_cursor {border-left-width: 1px;}.ace_overwrite-cursors .ace_cursor {border-left-width: 0;border-bottom: 1px solid;}.ace_hidden-cursors .ace_cursor {opacity: 0.2;}.ace_smooth-blinking .ace_cursor {-webkit-transition: opacity 0.18s;transition: opacity 0.18s;}.ace_editor.ace_multiselect .ace_cursor {border-left-width: 1px;}.ace_marker-layer .ace_step, .ace_marker-layer .ace_stack {position: absolute;z-index: 3;}.ace_marker-layer .ace_selection {position: absolute;z-index: 5;}.ace_marker-layer .ace_bracket {position: absolute;z-index: 6;}.ace_marker-layer .ace_active-line {position: absolute;z-index: 2;}.ace_marker-layer .ace_selected-word {position: absolute;z-index: 4;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;}.ace_line .ace_fold {-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;display: inline-block;height: 11px;margin-top: -2px;vertical-align: middle;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACJJREFUeNpi+P//fxgTAwPDBxDxD078RSX+YeEyDFMCIMAAI3INmXiwf2YAAAAASUVORK5CYII=");background-repeat: no-repeat, repeat-x;background-position: center center, top left;color: transparent;border: 1px solid black;border-radius: 2px;cursor: pointer;pointer-events: auto;}.ace_dark .ace_fold {}.ace_fold:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpi+P//fz4TAwPDZxDxD5X4i5fLMEwJgAADAEPVDbjNw87ZAAAAAElFTkSuQmCC");}.ace_tooltip {background-color: #FFF;background-image: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, 0.1));background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));border: 1px solid gray;border-radius: 1px;box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);color: black;max-width: 100%;padding: 3px 4px;position: fixed;z-index: 999999;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;cursor: default;white-space: pre;word-wrap: break-word;line-height: normal;font-style: normal;font-weight: normal;letter-spacing: normal;pointer-events: none;}.ace_folding-enabled > .ace_gutter-cell {padding-right: 13px;}.ace_fold-widget {-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;margin: 0 -12px 0 1px;display: none;width: 11px;vertical-align: top;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42mWKsQ0AMAzC8ixLlrzQjzmBiEjp0A6WwBCSPgKAXoLkqSot7nN3yMwR7pZ32NzpKkVoDBUxKAAAAABJRU5ErkJggg==");background-repeat: no-repeat;background-position: center;border-radius: 3px;border: 1px solid transparent;cursor: pointer;}.ace_folding-enabled .ace_fold-widget {display: inline-block;   }.ace_fold-widget.ace_end {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42m3HwQkAMAhD0YzsRchFKI7sAikeWkrxwScEB0nh5e7KTPWimZki4tYfVbX+MNl4pyZXejUO1QAAAABJRU5ErkJggg==");}.ace_fold-widget.ace_closed {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAYAAAAG5SQMAAAAOUlEQVR42jXKwQkAMAgDwKwqKD4EwQ26sSOkVWjgIIHAzPiCgaqiqnJHZnKICBERHN194O5b9vbLuAVRL+l0YWnZAAAAAElFTkSuQmCCXA==");}.ace_fold-widget:hover {border: 1px solid rgba(0, 0, 0, 0.3);background-color: rgba(255, 255, 255, 0.2);box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);}.ace_fold-widget:active {border: 1px solid rgba(0, 0, 0, 0.4);background-color: rgba(0, 0, 0, 0.05);box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);}.ace_dark .ace_fold-widget {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHklEQVQIW2P4//8/AzoGEQ7oGCaLLAhWiSwB146BAQCSTPYocqT0AAAAAElFTkSuQmCC");}.ace_dark .ace_fold-widget.ace_end {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAH0lEQVQIW2P4//8/AxQ7wNjIAjDMgC4AxjCVKBirIAAF0kz2rlhxpAAAAABJRU5ErkJggg==");}.ace_dark .ace_fold-widget.ace_closed {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAHElEQVQIW2P4//+/AxAzgDADlOOAznHAKgPWAwARji8UIDTfQQAAAABJRU5ErkJggg==");}.ace_dark .ace_fold-widget:hover {box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);background-color: rgba(255, 255, 255, 0.1);}.ace_dark .ace_fold-widget:active {box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);}.ace_fold-widget.ace_invalid {background-color: #FFB4B4;border-color: #DE5555;}.ace_fade-fold-widgets .ace_fold-widget {-webkit-transition: opacity 0.4s ease 0.05s;transition: opacity 0.4s ease 0.05s;opacity: 0;}.ace_fade-fold-widgets:hover .ace_fold-widget {-webkit-transition: opacity 0.05s ease 0.05s;transition: opacity 0.05s ease 0.05s;opacity:1;}.ace_underline {text-decoration: underline;}.ace_bold {font-weight: bold;}.ace_nobold .ace_bold {font-weight: normal;}.ace_italic {font-style: italic;}.ace_error-marker {background-color: rgba(255, 0, 0,0.2);position: absolute;z-index: 9;}.ace_highlight-marker {background-color: rgba(255, 255, 0,0.2);position: absolute;z-index: 8;}.ace_br1 {border-top-left-radius    : 3px;}.ace_br2 {border-top-right-radius   : 3px;}.ace_br3 {border-top-left-radius    : 3px; border-top-right-radius:    3px;}.ace_br4 {border-bottom-right-radius: 3px;}.ace_br5 {border-top-left-radius    : 3px; border-bottom-right-radius: 3px;}.ace_br6 {border-top-right-radius   : 3px; border-bottom-right-radius: 3px;}.ace_br7 {border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px;}.ace_br8 {border-bottom-left-radius : 3px;}.ace_br9 {border-top-left-radius    : 3px; border-bottom-left-radius:  3px;}.ace_br10{border-top-right-radius   : 3px; border-bottom-left-radius:  3px;}.ace_br11{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-left-radius:  3px;}.ace_br12{border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}.ace_br13{border-top-left-radius    : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}.ace_br14{border-top-right-radius   : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}.ace_br15{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;}';
    i.importCssString(m, "ace_editor.css");
    var g = function(e, t) {
      var n = this;
      (this.container = e || i.createElement("div")),
        (this.$keepTextAreaAtCursor = true),
        i.addCssClass(this.container, "ace_editor"),
        this.setTheme(t),
        (this.$gutter = i.createElement("div")),
        (this.$gutter.className = "ace_gutter"),
        this.container.appendChild(this.$gutter),
        (this.scroller = i.createElement("div")),
        (this.scroller.className = "ace_scroller"),
        this.container.appendChild(this.scroller),
        (this.content = i.createElement("div")),
        (this.content.className = "ace_content"),
        this.scroller.appendChild(this.content),
        (this.$gutterLayer = new u(this.$gutter)),
        this.$gutterLayer.on(
          "changeGutterWidth",
          this.onGutterResize.bind(this)
        ),
        (this.$markerBack = new a(this.content));
      var r = (this.$textLayer = new f(this.content));
      (this.canvas = r.element),
        (this.$markerFront = new a(this.content)),
        (this.$cursorLayer = new l(this.content)),
        (this.$horizScroll = !1),
        (this.$vScroll = !1),
        (this.scrollBar = this.scrollBarV = new h(this.container, this)),
        (this.scrollBarH = new c(this.container, this)),
        this.scrollBarV.addEventListener("scroll", function(e) {
          n.$scrollAnimation ||
            n.session.setScrollTop(e.data - n.scrollMargin.top);
        }),
        this.scrollBarH.addEventListener("scroll", function(e) {
          n.$scrollAnimation ||
            n.session.setScrollLeft(e.data - n.scrollMargin.left);
        }),
        (this.scrollTop = 0),
        (this.scrollLeft = 0),
        (this.cursorPos = { row: 0, column: 0 }),
        (this.$fontMetrics = new d(this.container)),
        this.$textLayer.$setFontMetrics(this.$fontMetrics),
        this.$textLayer.addEventListener("changeCharacterSize", function(e) {
          n.updateCharacterSize(),
            n.onResize(!0, n.gutterWidth, n.$size.width, n.$size.height),
            n._signal("changeCharacterSize", e);
        }),
        (this.$size = {
          width: 0,
          height: 0,
          scrollerHeight: 0,
          scrollerWidth: 0,
          $dirty: !0
        }),
        (this.layerConfig = {
          width: 1,
          padding: 0,
          firstRow: 0,
          firstRowScreen: 0,
          lastRow: 0,
          lineHeight: 0,
          characterWidth: 0,
          minHeight: 1,
          maxHeight: 1,
          offset: 0,
          height: 1,
          gutterOffset: 1
        }),
        (this.scrollMargin = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          v: 0,
          h: 0
        }),
        (this.$loop = new p(
          this.$renderChanges.bind(this),
          this.container.ownerDocument.defaultView
        )),
        this.$loop.schedule(this.CHANGE_FULL),
        this.updateCharacterSize(),
        this.setPadding(4),
        s.resetOptions(this),
        s._emit("renderer", this);
    };
    (function() {
      (this.CHANGE_CURSOR = 1),
        (this.CHANGE_MARKER = 2),
        (this.CHANGE_GUTTER = 4),
        (this.CHANGE_SCROLL = 8),
        (this.CHANGE_LINES = 16),
        (this.CHANGE_TEXT = 32),
        (this.CHANGE_SIZE = 64),
        (this.CHANGE_MARKER_BACK = 128),
        (this.CHANGE_MARKER_FRONT = 256),
        (this.CHANGE_FULL = 512),
        (this.CHANGE_H_SCROLL = 1024),
        r.implement(this, v),
        (this.updateCharacterSize = function() {
          this.$textLayer.allowBoldFonts != this.$allowBoldFonts &&
            ((this.$allowBoldFonts = this.$textLayer.allowBoldFonts),
            this.setStyle("ace_nobold", !this.$allowBoldFonts)),
            (this.layerConfig.characterWidth = this.characterWidth = this.$textLayer.getCharacterWidth()),
            (this.layerConfig.lineHeight = this.lineHeight = this.$textLayer.getLineHeight()),
            this.$updatePrintMargin();
        }),
        (this.setSession = function(e) {
          this.session &&
            this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode),
            (this.session = e),
            e &&
              this.scrollMargin.top &&
              e.getScrollTop() <= 0 &&
              e.setScrollTop(-this.scrollMargin.top),
            this.$cursorLayer.setSession(e),
            this.$markerBack.setSession(e),
            this.$markerFront.setSession(e),
            this.$gutterLayer.setSession(e),
            this.$textLayer.setSession(e);
          if (!e) return;
          this.$loop.schedule(this.CHANGE_FULL),
            this.session.$setFontMetrics(this.$fontMetrics),
            (this.scrollBarV.scrollLeft = this.scrollBarV.scrollTop = null),
            (this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this)),
            this.onChangeNewLineMode(),
            this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode);
        }),
        (this.updateLines = function(e, t, n) {
          t === undefined && (t = Infinity),
            this.$changedLines
              ? (this.$changedLines.firstRow > e &&
                  (this.$changedLines.firstRow = e),
                this.$changedLines.lastRow < t &&
                  (this.$changedLines.lastRow = t))
              : (this.$changedLines = { firstRow: e, lastRow: t });
          if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
            if (!n) return;
            this.$changedLines.lastRow = this.layerConfig.lastRow;
          }
          if (this.$changedLines.firstRow > this.layerConfig.lastRow) return;
          this.$loop.schedule(this.CHANGE_LINES);
        }),
        (this.onChangeNewLineMode = function() {
          this.$loop.schedule(this.CHANGE_TEXT),
            this.$textLayer.$updateEolChar();
        }),
        (this.onChangeTabSize = function() {
          this.$loop.schedule(this.CHANGE_TEXT | this.CHANGE_MARKER),
            this.$textLayer.onChangeTabSize();
        }),
        (this.updateText = function() {
          this.$loop.schedule(this.CHANGE_TEXT);
        }),
        (this.updateFull = function(e) {
          e
            ? this.$renderChanges(this.CHANGE_FULL, !0)
            : this.$loop.schedule(this.CHANGE_FULL);
        }),
        (this.updateFontSize = function() {
          this.$textLayer.checkForSizeChanges();
        }),
        (this.$changes = 0),
        (this.$updateSizeAsync = function() {
          this.$loop.pending ? (this.$size.$dirty = !0) : this.onResize();
        }),
        (this.onResize = function(e, t, n, r) {
          if (this.resizing > 2) return;
          this.resizing > 0 ? this.resizing++ : (this.resizing = e ? 1 : 0);
          var i = this.container;
          r || (r = i.clientHeight || i.scrollHeight),
            n || (n = i.clientWidth || i.scrollWidth);
          var s = this.$updateCachedSize(e, t, n, r);
          if (!this.$size.scrollerHeight || (!n && !r))
            return (this.resizing = 0);
          e && (this.$gutterLayer.$padding = null),
            e
              ? this.$renderChanges(s | this.$changes, !0)
              : this.$loop.schedule(s | this.$changes),
            this.resizing && (this.resizing = 0),
            (this.scrollBarV.scrollLeft = this.scrollBarV.scrollTop = null);
        }),
        (this.$updateCachedSize = function(e, t, n, r) {
          r -= this.$extraHeight || 0;
          var i = 0,
            s = this.$size,
            o = {
              width: s.width,
              height: s.height,
              scrollerHeight: s.scrollerHeight,
              scrollerWidth: s.scrollerWidth
            };
          r &&
            (e || s.height != r) &&
            ((s.height = r),
            (i |= this.CHANGE_SIZE),
            (s.scrollerHeight = s.height),
            this.$horizScroll &&
              (s.scrollerHeight -= this.scrollBarH.getHeight()),
            (this.scrollBarV.element.style.bottom =
              this.scrollBarH.getHeight() + "px"),
            (i |= this.CHANGE_SCROLL));
          if (n && (e || s.width != n)) {
            (i |= this.CHANGE_SIZE),
              (s.width = n),
              t == null &&
                (t = this.$showGutter ? this.$gutter.offsetWidth : 0),
              (this.gutterWidth = t),
              (this.scrollBarH.element.style.left = this.scroller.style.left =
                t + "px"),
              (s.scrollerWidth = Math.max(
                0,
                n - t - this.scrollBarV.getWidth()
              )),
              (this.scrollBarH.element.style.right = this.scroller.style.right =
                this.scrollBarV.getWidth() + "px"),
              (this.scroller.style.bottom = this.scrollBarH.getHeight() + "px");
            if (
              (this.session &&
                this.session.getUseWrapMode() &&
                this.adjustWrapLimit()) ||
              e
            )
              i |= this.CHANGE_FULL;
          }
          return (s.$dirty = !n || !r), i && this._signal("resize", o), i;
        }),
        (this.onGutterResize = function() {
          var e = this.$showGutter ? this.$gutter.offsetWidth : 0;
          e != this.gutterWidth &&
            (this.$changes |= this.$updateCachedSize(
              !0,
              e,
              this.$size.width,
              this.$size.height
            )),
            this.session.getUseWrapMode() && this.adjustWrapLimit()
              ? this.$loop.schedule(this.CHANGE_FULL)
              : this.$size.$dirty
              ? this.$loop.schedule(this.CHANGE_FULL)
              : (this.$computeLayerConfig(),
                this.$loop.schedule(this.CHANGE_MARKER));
        }),
        (this.adjustWrapLimit = function() {
          var e = this.$size.scrollerWidth - this.$padding * 2,
            t = Math.floor(e / this.characterWidth);
          return this.session.adjustWrapLimit(
            t,
            this.$showPrintMargin && this.$printMarginColumn
          );
        }),
        (this.setAnimatedScroll = function(e) {
          this.setOption("animatedScroll", e);
        }),
        (this.getAnimatedScroll = function() {
          return this.$animatedScroll;
        }),
        (this.setShowInvisibles = function(e) {
          this.setOption("showInvisibles", e);
        }),
        (this.getShowInvisibles = function() {
          return this.getOption("showInvisibles");
        }),
        (this.getDisplayIndentGuides = function() {
          return this.getOption("displayIndentGuides");
        }),
        (this.setDisplayIndentGuides = function(e) {
          this.setOption("displayIndentGuides", e);
        }),
        (this.setShowPrintMargin = function(e) {
          this.setOption("showPrintMargin", e);
        }),
        (this.getShowPrintMargin = function() {
          return this.getOption("showPrintMargin");
        }),
        (this.setPrintMarginColumn = function(e) {
          this.setOption("printMarginColumn", e);
        }),
        (this.getPrintMarginColumn = function() {
          return this.getOption("printMarginColumn");
        }),
        (this.getShowGutter = function() {
          return this.getOption("showGutter");
        }),
        (this.setShowGutter = function(e) {
          return this.setOption("showGutter", e);
        }),
        (this.getFadeFoldWidgets = function() {
          return this.getOption("fadeFoldWidgets");
        }),
        (this.setFadeFoldWidgets = function(e) {
          this.setOption("fadeFoldWidgets", e);
        }),
        (this.setHighlightGutterLine = function(e) {
          this.setOption("highlightGutterLine", e);
        }),
        (this.getHighlightGutterLine = function() {
          return this.getOption("highlightGutterLine");
        }),
        (this.$updateGutterLineHighlight = function() {
          var e = this.$cursorLayer.$pixelPos,
            t = this.layerConfig.lineHeight;
          if (this.session.getUseWrapMode()) {
            var n = this.session.selection.getCursor();
            (n.column = 0),
              (e = this.$cursorLayer.getPixelPosition(n, !0)),
              (t *= this.session.getRowLength(n.row));
          }
          (this.$gutterLineHighlight.style.top =
            e.top - this.layerConfig.offset + "px"),
            (this.$gutterLineHighlight.style.height = t + "px");
        }),
        (this.$updatePrintMargin = function() {
          if (!this.$showPrintMargin && !this.$printMarginEl) return;
          if (!this.$printMarginEl) {
            var e = i.createElement("div");
            (e.className = "ace_layer ace_print-margin-layer"),
              (this.$printMarginEl = i.createElement("div")),
              (this.$printMarginEl.className = "ace_print-margin"),
              e.appendChild(this.$printMarginEl),
              this.content.insertBefore(e, this.content.firstChild);
          }
          var t = this.$printMarginEl.style;
          (t.left =
            this.characterWidth * this.$printMarginColumn +
            this.$padding +
            "px"),
            (t.visibility = this.$showPrintMargin ? "visible" : "hidden"),
            this.session && this.session.$wrap == -1 && this.adjustWrapLimit();
        }),
        (this.getContainerElement = function() {
          return this.container;
        }),
        (this.getMouseEventTarget = function() {
          return this.scroller;
        }),
        (this.getTextAreaContainer = function() {
          return this.container;
        }),
        (this.$moveTextAreaToCursor = function() {
          if (!this.$keepTextAreaAtCursor) return;
          var e = this.layerConfig,
            t = this.$cursorLayer.$pixelPos.top,
            n = this.$cursorLayer.$pixelPos.left;
          t -= e.offset;
          var r = this.textarea.style,
            i = this.lineHeight;
          if (t < 0 || t > e.height - i) {
            r.top = r.left = "0";
            return;
          }
          var s = this.characterWidth;
          if (this.$composition) {
            var o = this.textarea.value.replace(/^\x01+/, "");
            (s *= this.session.$getStringScreenWidth(o)[0] + 2), (i += 2);
          }
          (n -= this.scrollLeft),
            n > this.$size.scrollerWidth - s &&
              (n = this.$size.scrollerWidth - s),
            (n += this.gutterWidth),
            (r.height = i + "px"),
            (r.width = s + "px"),
            (r.left = Math.min(n, this.$size.scrollerWidth - s) + "px"),
            (r.top = Math.min(t, this.$size.height - i) + "px");
        }),
        (this.getFirstVisibleRow = function() {
          return this.layerConfig.firstRow;
        }),
        (this.getFirstFullyVisibleRow = function() {
          return (
            this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1)
          );
        }),
        (this.getLastFullyVisibleRow = function() {
          var e = this.layerConfig,
            t = e.lastRow,
            n = this.session.documentToScreenRow(t, 0) * e.lineHeight;
          return n - this.session.getScrollTop() > e.height - e.lineHeight
            ? t - 1
            : t;
        }),
        (this.getLastVisibleRow = function() {
          return this.layerConfig.lastRow;
        }),
        (this.$padding = null),
        (this.setPadding = function(e) {
          (this.$padding = e),
            this.$textLayer.setPadding(e),
            this.$cursorLayer.setPadding(e),
            this.$markerFront.setPadding(e),
            this.$markerBack.setPadding(e),
            this.$loop.schedule(this.CHANGE_FULL),
            this.$updatePrintMargin();
        }),
        (this.setScrollMargin = function(e, t, n, r) {
          var i = this.scrollMargin;
          (i.top = e | 0),
            (i.bottom = t | 0),
            (i.right = r | 0),
            (i.left = n | 0),
            (i.v = i.top + i.bottom),
            (i.h = i.left + i.right),
            i.top &&
              this.scrollTop <= 0 &&
              this.session &&
              this.session.setScrollTop(-i.top),
            this.updateFull();
        }),
        (this.getHScrollBarAlwaysVisible = function() {
          return this.$hScrollBarAlwaysVisible;
        }),
        (this.setHScrollBarAlwaysVisible = function(e) {
          this.setOption("hScrollBarAlwaysVisible", e);
        }),
        (this.getVScrollBarAlwaysVisible = function() {
          return this.$vScrollBarAlwaysVisible;
        }),
        (this.setVScrollBarAlwaysVisible = function(e) {
          this.setOption("vScrollBarAlwaysVisible", e);
        }),
        (this.$updateScrollBarV = function() {
          var e = this.layerConfig.maxHeight,
            t = this.$size.scrollerHeight;
          !this.$maxLines &&
            this.$scrollPastEnd &&
            ((e -= (t - this.lineHeight) * this.$scrollPastEnd),
            this.scrollTop > e - t &&
              ((e = this.scrollTop + t), (this.scrollBarV.scrollTop = null))),
            this.scrollBarV.setScrollHeight(e + this.scrollMargin.v),
            this.scrollBarV.setScrollTop(
              this.scrollTop + this.scrollMargin.top
            );
        }),
        (this.$updateScrollBarH = function() {
          this.scrollBarH.setScrollWidth(
            this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h
          ),
            this.scrollBarH.setScrollLeft(
              this.scrollLeft + this.scrollMargin.left
            );
        }),
        (this.$frozen = !1),
        (this.freeze = function() {
          this.$frozen = !0;
        }),
        (this.unfreeze = function() {
          this.$frozen = !1;
        }),
        (this.$renderChanges = function(e, t) {
          this.$changes && ((e |= this.$changes), (this.$changes = 0));
          if (
            !this.session ||
            !this.container.offsetWidth ||
            this.$frozen ||
            (!e && !t)
          ) {
            this.$changes |= e;
            return;
          }
          if (this.$size.$dirty) return (this.$changes |= e), this.onResize(!0);
          this.lineHeight || this.$textLayer.checkForSizeChanges(),
            this._signal("beforeRender");
          var n = this.layerConfig;
          if (
            e & this.CHANGE_FULL ||
            e & this.CHANGE_SIZE ||
            e & this.CHANGE_TEXT ||
            e & this.CHANGE_LINES ||
            e & this.CHANGE_SCROLL ||
            e & this.CHANGE_H_SCROLL
          ) {
            e |= this.$computeLayerConfig();
            if (
              n.firstRow != this.layerConfig.firstRow &&
              n.firstRowScreen == this.layerConfig.firstRowScreen
            ) {
              var r =
                this.scrollTop +
                (n.firstRow - this.layerConfig.firstRow) * this.lineHeight;
              r > 0 &&
                ((this.scrollTop = r),
                (e |= this.CHANGE_SCROLL),
                (e |= this.$computeLayerConfig()));
            }
            (n = this.layerConfig),
              this.$updateScrollBarV(),
              e & this.CHANGE_H_SCROLL && this.$updateScrollBarH(),
              (this.$gutterLayer.element.style.marginTop = -n.offset + "px"),
              (this.content.style.marginTop = -n.offset + "px"),
              (this.content.style.width = n.width + 2 * this.$padding + "px"),
              (this.content.style.height = n.minHeight + "px");
          }
          e & this.CHANGE_H_SCROLL &&
            ((this.content.style.marginLeft = -this.scrollLeft + "px"),
            (this.scroller.className =
              this.scrollLeft <= 0
                ? "ace_scroller"
                : "ace_scroller ace_scroll-left"));
          if (e & this.CHANGE_FULL) {
            this.$textLayer.update(n),
              this.$showGutter && this.$gutterLayer.update(n),
              this.$markerBack.update(n),
              this.$markerFront.update(n),
              this.$cursorLayer.update(n),
              this.$moveTextAreaToCursor(),
              this.$highlightGutterLine && this.$updateGutterLineHighlight(),
              this._signal("afterRender");
            return;
          }
          if (e & this.CHANGE_SCROLL) {
            e & this.CHANGE_TEXT || e & this.CHANGE_LINES
              ? this.$textLayer.update(n)
              : this.$textLayer.scrollLines(n),
              this.$showGutter && this.$gutterLayer.update(n),
              this.$markerBack.update(n),
              this.$markerFront.update(n),
              this.$cursorLayer.update(n),
              this.$highlightGutterLine && this.$updateGutterLineHighlight(),
              this.$moveTextAreaToCursor(),
              this._signal("afterRender");
            return;
          }
          e & this.CHANGE_TEXT
            ? (this.$textLayer.update(n),
              this.$showGutter && this.$gutterLayer.update(n))
            : e & this.CHANGE_LINES
            ? (this.$updateLines() ||
                (e & this.CHANGE_GUTTER && this.$showGutter)) &&
              this.$gutterLayer.update(n)
            : (e & this.CHANGE_TEXT || e & this.CHANGE_GUTTER) &&
              this.$showGutter &&
              this.$gutterLayer.update(n),
            e & this.CHANGE_CURSOR &&
              (this.$cursorLayer.update(n),
              this.$moveTextAreaToCursor(),
              this.$highlightGutterLine && this.$updateGutterLineHighlight()),
            e & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT) &&
              this.$markerFront.update(n),
            e & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK) &&
              this.$markerBack.update(n),
            this._signal("afterRender");
        }),
        (this.$autosize = function() {
          var e = this.session.getScreenLength() * this.lineHeight,
            t = this.$maxLines * this.lineHeight,
            n =
              Math.min(
                t,
                Math.max((this.$minLines || 1) * this.lineHeight, e)
              ) +
              this.scrollMargin.v +
              (this.$extraHeight || 0);
          this.$horizScroll && (n += this.scrollBarH.getHeight()),
            this.$maxPixelHeight &&
              n > this.$maxPixelHeight &&
              (n = this.$maxPixelHeight);
          var r = e > t;
          if (
            n != this.desiredHeight ||
            this.$size.height != this.desiredHeight ||
            r != this.$vScroll
          ) {
            r != this.$vScroll &&
              ((this.$vScroll = r), this.scrollBarV.setVisible(r));
            var i = this.container.clientWidth;
            (this.container.style.height = n + "px"),
              this.$updateCachedSize(!0, this.$gutterWidth, i, n),
              (this.desiredHeight = n),
              this._signal("autosize");
          }
        }),
        (this.$computeLayerConfig = function() {
          var e = this.session,
            t = this.$size,
            n = t.height <= 2 * this.lineHeight,
            r = this.session.getScreenLength(),
            i = r * this.lineHeight,
            s = this.$getLongestLine(),
            o =
              !n &&
              (this.$hScrollBarAlwaysVisible ||
                t.scrollerWidth - s - 2 * this.$padding < 0),
            u = this.$horizScroll !== o;
          u && ((this.$horizScroll = o), this.scrollBarH.setVisible(o));
          var a = this.$vScroll;
          this.$maxLines && this.lineHeight > 1 && this.$autosize();
          var f = this.scrollTop % this.lineHeight,
            l = t.scrollerHeight + this.lineHeight,
            c =
              !this.$maxLines && this.$scrollPastEnd
                ? (t.scrollerHeight - this.lineHeight) * this.$scrollPastEnd
                : 0;
          i += c;
          var h = this.scrollMargin;
          this.session.setScrollTop(
            Math.max(
              -h.top,
              Math.min(this.scrollTop, i - t.scrollerHeight + h.bottom)
            )
          ),
            this.session.setScrollLeft(
              Math.max(
                -h.left,
                Math.min(
                  this.scrollLeft,
                  s + 2 * this.$padding - t.scrollerWidth + h.right
                )
              )
            );
          var p =
              !n &&
              (this.$vScrollBarAlwaysVisible ||
                t.scrollerHeight - i + c < 0 ||
                this.scrollTop > h.top),
            d = a !== p;
          d && ((this.$vScroll = p), this.scrollBarV.setVisible(p));
          var v = Math.ceil(l / this.lineHeight) - 1,
            m = Math.max(0, Math.round((this.scrollTop - f) / this.lineHeight)),
            g = m + v,
            y,
            b,
            w = this.lineHeight;
          m = e.screenToDocumentRow(m, 0);
          var E = e.getFoldLine(m);
          E && (m = E.start.row),
            (y = e.documentToScreenRow(m, 0)),
            (b = e.getRowLength(m) * w),
            (g = Math.min(e.screenToDocumentRow(g, 0), e.getLength() - 1)),
            (l = t.scrollerHeight + e.getRowLength(g) * w + b),
            (f = this.scrollTop - y * w);
          var S = 0;
          this.layerConfig.width != s && (S = this.CHANGE_H_SCROLL);
          if (u || d)
            (S = this.$updateCachedSize(
              !0,
              this.gutterWidth,
              t.width,
              t.height
            )),
              this._signal("scrollbarVisibilityChanged"),
              d && (s = this.$getLongestLine());
          return (
            (this.layerConfig = {
              width: s,
              padding: this.$padding,
              firstRow: m,
              firstRowScreen: y,
              lastRow: g,
              lineHeight: w,
              characterWidth: this.characterWidth,
              minHeight: l,
              maxHeight: i,
              offset: f,
              gutterOffset: w
                ? Math.max(0, Math.ceil((f + t.height - t.scrollerHeight) / w))
                : 0,
              height: this.$size.scrollerHeight
            }),
            S
          );
        }),
        (this.$updateLines = function() {
          var e = this.$changedLines.firstRow,
            t = this.$changedLines.lastRow;
          this.$changedLines = null;
          var n = this.layerConfig;
          if (e > n.lastRow + 1) return;
          if (t < n.firstRow) return;
          if (t === Infinity) {
            this.$showGutter && this.$gutterLayer.update(n),
              this.$textLayer.update(n);
            return;
          }
          return this.$textLayer.updateLines(n, e, t), !0;
        }),
        (this.$getLongestLine = function() {
          var e = this.session.getScreenWidth();
          return (
            this.showInvisibles && !this.session.$useWrapMode && (e += 1),
            Math.max(
              this.$size.scrollerWidth - 2 * this.$padding,
              Math.round(e * this.characterWidth)
            )
          );
        }),
        (this.updateFrontMarkers = function() {
          this.$markerFront.setMarkers(this.session.getMarkers(!0)),
            this.$loop.schedule(this.CHANGE_MARKER_FRONT);
        }),
        (this.updateBackMarkers = function() {
          this.$markerBack.setMarkers(this.session.getMarkers()),
            this.$loop.schedule(this.CHANGE_MARKER_BACK);
        }),
        (this.addGutterDecoration = function(e, t) {
          this.$gutterLayer.addGutterDecoration(e, t);
        }),
        (this.removeGutterDecoration = function(e, t) {
          this.$gutterLayer.removeGutterDecoration(e, t);
        }),
        (this.updateBreakpoints = function(e) {
          this.$loop.schedule(this.CHANGE_GUTTER);
        }),
        (this.setAnnotations = function(e) {
          this.$gutterLayer.setAnnotations(e),
            this.$loop.schedule(this.CHANGE_GUTTER);
        }),
        (this.updateCursor = function() {
          this.$loop.schedule(this.CHANGE_CURSOR);
        }),
        (this.hideCursor = function() {
          this.$cursorLayer.hideCursor();
        }),
        (this.showCursor = function() {
          this.$cursorLayer.showCursor();
        }),
        (this.scrollSelectionIntoView = function(e, t, n) {
          this.scrollCursorIntoView(e, n), this.scrollCursorIntoView(t, n);
        }),
        (this.scrollCursorIntoView = function(e, t, n) {
          if (this.$size.scrollerHeight === 0) return;
          var r = this.$cursorLayer.getPixelPosition(e),
            i = r.left,
            s = r.top,
            o = (n && n.top) || 0,
            u = (n && n.bottom) || 0,
            a = this.$scrollAnimation
              ? this.session.getScrollTop()
              : this.scrollTop;
          a + o > s
            ? (t &&
                a + o > s + this.lineHeight &&
                (s -= t * this.$size.scrollerHeight),
              s === 0 && (s = -this.scrollMargin.top),
              this.session.setScrollTop(s))
            : a + this.$size.scrollerHeight - u < s + this.lineHeight &&
              (t &&
                a + this.$size.scrollerHeight - u < s - this.lineHeight &&
                (s += t * this.$size.scrollerHeight),
              this.session.setScrollTop(
                s + this.lineHeight - this.$size.scrollerHeight
              ));
          var f = this.scrollLeft;
          f > i
            ? (i < this.$padding + 2 * this.layerConfig.characterWidth &&
                (i = -this.scrollMargin.left),
              this.session.setScrollLeft(i))
            : f + this.$size.scrollerWidth < i + this.characterWidth
            ? this.session.setScrollLeft(
                Math.round(i + this.characterWidth - this.$size.scrollerWidth)
              )
            : f <= this.$padding &&
              i - f < this.characterWidth &&
              this.session.setScrollLeft(0);
        }),
        (this.getScrollTop = function() {
          return this.session.getScrollTop();
        }),
        (this.getScrollLeft = function() {
          return this.session.getScrollLeft();
        }),
        (this.getScrollTopRow = function() {
          return this.scrollTop / this.lineHeight;
        }),
        (this.getScrollBottomRow = function() {
          return Math.max(
            0,
            Math.floor(
              (this.scrollTop + this.$size.scrollerHeight) / this.lineHeight
            ) - 1
          );
        }),
        (this.scrollToRow = function(e) {
          this.session.setScrollTop(e * this.lineHeight);
        }),
        (this.alignCursor = function(e, t) {
          typeof e == "number" && (e = { row: e, column: 0 });
          var n = this.$cursorLayer.getPixelPosition(e),
            r = this.$size.scrollerHeight - this.lineHeight,
            i = n.top - r * (t || 0);
          return this.session.setScrollTop(i), i;
        }),
        (this.STEPS = 8),
        (this.$calcSteps = function(e, t) {
          var n = 0,
            r = this.STEPS,
            i = [],
            s = function(e, t, n) {
              return n * (Math.pow(e - 1, 3) + 1) + t;
            };
          for (n = 0; n < r; ++n) i.push(s(n / this.STEPS, e, t - e));
          return i;
        }),
        (this.scrollToLine = function(e, t, n, r) {
          var i = this.$cursorLayer.getPixelPosition({ row: e, column: 0 }),
            s = i.top;
          t && (s -= this.$size.scrollerHeight / 2);
          var o = this.scrollTop;
          this.session.setScrollTop(s), n !== !1 && this.animateScrolling(o, r);
        }),
        (this.animateScrolling = function(e, t) {
          var n = this.scrollTop;
          if (!this.$animatedScroll) return;
          var r = this;
          if (e == n) return;
          if (this.$scrollAnimation) {
            var i = this.$scrollAnimation.steps;
            if (i.length) {
              e = i[0];
              if (e == n) return;
            }
          }
          var s = r.$calcSteps(e, n);
          (this.$scrollAnimation = { from: e, to: n, steps: s }),
            clearInterval(this.$timer),
            r.session.setScrollTop(s.shift()),
            (r.session.$scrollTop = n),
            (this.$timer = setInterval(function() {
              s.length
                ? (r.session.setScrollTop(s.shift()),
                  (r.session.$scrollTop = n))
                : n != null
                ? ((r.session.$scrollTop = -1),
                  r.session.setScrollTop(n),
                  (n = null))
                : ((r.$timer = clearInterval(r.$timer)),
                  (r.$scrollAnimation = null),
                  t && t());
            }, 10));
        }),
        (this.scrollToY = function(e) {
          this.scrollTop !== e &&
            (this.$loop.schedule(this.CHANGE_SCROLL), (this.scrollTop = e));
        }),
        (this.scrollToX = function(e) {
          this.scrollLeft !== e && (this.scrollLeft = e),
            this.$loop.schedule(this.CHANGE_H_SCROLL);
        }),
        (this.scrollTo = function(e, t) {
          this.session.setScrollTop(t), this.session.setScrollLeft(t);
        }),
        (this.scrollBy = function(e, t) {
          t && this.session.setScrollTop(this.session.getScrollTop() + t),
            e && this.session.setScrollLeft(this.session.getScrollLeft() + e);
        }),
        (this.isScrollableBy = function(e, t) {
          if (t < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top)
            return !0;
          if (
            t > 0 &&
            this.session.getScrollTop() +
              this.$size.scrollerHeight -
              this.layerConfig.maxHeight <
              -1 + this.scrollMargin.bottom
          )
            return !0;
          if (
            e < 0 &&
            this.session.getScrollLeft() >= 1 - this.scrollMargin.left
          )
            return !0;
          if (
            e > 0 &&
            this.session.getScrollLeft() +
              this.$size.scrollerWidth -
              this.layerConfig.width <
              -1 + this.scrollMargin.right
          )
            return !0;
        }),
        (this.pixelToScreenCoordinates = function(e, t) {
          var n = this.scroller.getBoundingClientRect(),
            r =
              (e + this.scrollLeft - n.left - this.$padding) /
              this.characterWidth,
            i = Math.floor((t + this.scrollTop - n.top) / this.lineHeight),
            s = Math.round(r);
          return { row: i, column: s, side: r - s > 0 ? 1 : -1 };
        }),
        (this.screenToTextCoordinates = function(e, t) {
          var n = this.scroller.getBoundingClientRect(),
            r = Math.round(
              (e + this.scrollLeft - n.left - this.$padding) /
                this.characterWidth
            ),
            i = (t + this.scrollTop - n.top) / this.lineHeight;
          return this.session.screenToDocumentPosition(i, Math.max(r, 0));
        }),
        (this.textToScreenCoordinates = function(e, t) {
          var n = this.scroller.getBoundingClientRect(),
            r = this.session.documentToScreenPosition(e, t),
            i = this.$padding + Math.round(r.column * this.characterWidth),
            s = r.row * this.lineHeight;
          return {
            pageX: n.left + i - this.scrollLeft,
            pageY: n.top + s - this.scrollTop
          };
        }),
        (this.visualizeFocus = function() {
          i.addCssClass(this.container, "ace_focus");
        }),
        (this.visualizeBlur = function() {
          i.removeCssClass(this.container, "ace_focus");
        }),
        (this.showComposition = function(e) {
          this.$composition ||
            (this.$composition = {
              keepTextAreaAtCursor: this.$keepTextAreaAtCursor,
              cssText: this.textarea.style.cssText
            }),
            (this.$keepTextAreaAtCursor = !0),
            i.addCssClass(this.textarea, "ace_composition"),
            (this.textarea.style.cssText = ""),
            this.$moveTextAreaToCursor();
        }),
        (this.setCompositionText = function(e) {
          this.$moveTextAreaToCursor();
        }),
        (this.hideComposition = function() {
          if (!this.$composition) return;
          i.removeCssClass(this.textarea, "ace_composition"),
            (this.$keepTextAreaAtCursor = this.$composition.keepTextAreaAtCursor),
            (this.textarea.style.cssText = this.$composition.cssText),
            (this.$composition = null);
        }),
        (this.setTheme = function(e, t) {
          function o(r) {
            if (n.$themeId != e) return t && t();
            if (!r || !r.cssClass)
              throw new Error(
                "couldn't load module " + e + " or it didn't call define"
              );
            i.importCssString(r.cssText, r.cssClass, n.container.ownerDocument),
              n.theme && i.removeCssClass(n.container, n.theme.cssClass);
            var s =
              "padding" in r
                ? r.padding
                : "padding" in (n.theme || {})
                ? 4
                : n.$padding;
            n.$padding && s != n.$padding && n.setPadding(s),
              (n.$theme = r.cssClass),
              (n.theme = r),
              i.addCssClass(n.container, r.cssClass),
              i.setCssClass(n.container, "ace_dark", r.isDark),
              n.$size && ((n.$size.width = 0), n.$updateSizeAsync()),
              n._dispatchEvent("themeLoaded", { theme: r }),
              t && t();
          }
          var n = this;
          (this.$themeId = e), n._dispatchEvent("themeChange", { theme: e });
          if (!e || typeof e == "string") {
            var r = e || this.$options.theme.initialValue;
            s.loadModule(["theme", r], o);
          } else o(e);
        }),
        (this.getTheme = function() {
          return this.$themeId;
        }),
        (this.setStyle = function(e, t) {
          i.setCssClass(this.container, e, t !== !1);
        }),
        (this.unsetStyle = function(e) {
          i.removeCssClass(this.container, e);
        }),
        (this.setCursorStyle = function(e) {
          this.scroller.style.cursor != e && (this.scroller.style.cursor = e);
        }),
        (this.setMouseCursor = function(e) {
          this.scroller.style.cursor = e;
        }),
        (this.destroy = function() {
          this.$textLayer.destroy(), this.$cursorLayer.destroy();
        });
    }.call(g.prototype),
      s.defineOptions(g.prototype, "renderer", {
        animatedScroll: { initialValue: !1 },
        showInvisibles: {
          set: function(e) {
            this.$textLayer.setShowInvisibles(e) &&
              this.$loop.schedule(this.CHANGE_TEXT);
          },
          initialValue: !1
        },
        showPrintMargin: {
          set: function() {
            this.$updatePrintMargin();
          },
          initialValue: !0
        },
        printMarginColumn: {
          set: function() {
            this.$updatePrintMargin();
          },
          initialValue: 80
        },
        printMargin: {
          set: function(e) {
            typeof e == "number" && (this.$printMarginColumn = e),
              (this.$showPrintMargin = !!e),
              this.$updatePrintMargin();
          },
          get: function() {
            return this.$showPrintMargin && this.$printMarginColumn;
          }
        },
        showGutter: {
          set: function(e) {
            (this.$gutter.style.display = e ? "block" : "none"),
              this.$loop.schedule(this.CHANGE_FULL),
              this.onGutterResize();
          },
          initialValue: !0
        },
        fadeFoldWidgets: {
          set: function(e) {
            i.setCssClass(this.$gutter, "ace_fade-fold-widgets", e);
          },
          initialValue: !1
        },
        showFoldWidgets: {
          set: function(e) {
            this.$gutterLayer.setShowFoldWidgets(e);
          },
          initialValue: !0
        },
        showLineNumbers: {
          set: function(e) {
            this.$gutterLayer.setShowLineNumbers(e),
              this.$loop.schedule(this.CHANGE_GUTTER);
          },
          initialValue: !0
        },
        displayIndentGuides: {
          set: function(e) {
            this.$textLayer.setDisplayIndentGuides(e) &&
              this.$loop.schedule(this.CHANGE_TEXT);
          },
          initialValue: !0
        },
        highlightGutterLine: {
          set: function(e) {
            if (!this.$gutterLineHighlight) {
              (this.$gutterLineHighlight = i.createElement("div")),
                (this.$gutterLineHighlight.className =
                  "ace_gutter-active-line"),
                this.$gutter.appendChild(this.$gutterLineHighlight);
              return;
            }
            (this.$gutterLineHighlight.style.display = e ? "" : "none"),
              this.$cursorLayer.$pixelPos && this.$updateGutterLineHighlight();
          },
          initialValue: !1,
          value: !0
        },
        hScrollBarAlwaysVisible: {
          set: function(e) {
            (!this.$hScrollBarAlwaysVisible || !this.$horizScroll) &&
              this.$loop.schedule(this.CHANGE_SCROLL);
          },
          initialValue: !1
        },
        vScrollBarAlwaysVisible: {
          set: function(e) {
            (!this.$vScrollBarAlwaysVisible || !this.$vScroll) &&
              this.$loop.schedule(this.CHANGE_SCROLL);
          },
          initialValue: !1
        },
        fontSize: {
          set: function(e) {
            typeof e == "number" && (e += "px"),
              (this.container.style.fontSize = e),
              this.updateFontSize();
          },
          initialValue: 12
        },
        fontFamily: {
          set: function(e) {
            (this.container.style.fontFamily = e), this.updateFontSize();
          }
        },
        maxLines: {
          set: function(e) {
            this.updateFull();
          }
        },
        minLines: {
          set: function(e) {
            this.updateFull();
          }
        },
        maxPixelHeight: {
          set: function(e) {
            this.updateFull();
          },
          initialValue: 0
        },
        scrollPastEnd: {
          set: function(e) {
            e = +e || 0;
            if (this.$scrollPastEnd == e) return;
            (this.$scrollPastEnd = e), this.$loop.schedule(this.CHANGE_SCROLL);
          },
          initialValue: 0,
          handlesSet: !0
        },
        fixedWidthGutter: {
          set: function(e) {
            (this.$gutterLayer.$fixedWidth = !!e),
              this.$loop.schedule(this.CHANGE_GUTTER);
          }
        },
        theme: {
          set: function(e) {
            this.setTheme(e);
          },
          get: function() {
            return this.$themeId || this.theme;
          },
          initialValue: "./theme/textmate",
          handlesSet: !0
        }
      }),
      (t.VirtualRenderer = g));
  }),

}
