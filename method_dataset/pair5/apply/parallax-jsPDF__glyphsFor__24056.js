function __method_wrapper__() {
  Subset.prototype.glyphsFor = function (glyphIDs) {
    var additionalIDs, glyph, glyphs, id, _i, _len, _ref;
    glyphs = {};
    for (_i = 0, _len = glyphIDs.length; _i < _len; _i++) {
      id = glyphIDs[_i];
      glyphs[id] = this.font.glyf.glyphFor(id);
    }
    additionalIDs = [];
    for (id in glyphs) {
      glyph = glyphs[id];
      if (glyph != null ? glyph.compound : void 0) {
        additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
      }
    }
    if (additionalIDs.length > 0) {
      _ref = this.glyphsFor(additionalIDs);
      for (id in _ref) {
        glyph = _ref[id];
        glyphs[id] = glyph;
      }
    }
    return glyphs;
  };

}
