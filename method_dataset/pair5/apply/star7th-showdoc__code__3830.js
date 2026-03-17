function __method_wrapper__() {
    markedRenderer.code = function(code, lang, escaped) {
      if (lang === 'seq' || lang === 'sequence') {
        return '<div class="sequence-diagram">' + code + '</div>'
      } else if (lang === 'flow') {
        return '<div class="flowchart">' + code + '</div>'
      } else if (lang === 'math' || lang === 'latex' || lang === 'katex') {
        return '<p class="' + editormd.classNames.tex + '">' + code + '</p>'
      } else if (/^mindmap/i.test(lang)) {
        var mapId = Math.ceil(Math.random() * 1000000)
        return (
          "<div class='mindmap' id='mindmap-" + mapId + "'>" + code + '</div>'
        )
      } else {
        return marked.Renderer.prototype.code.apply(this, arguments)
      }
    }

}
