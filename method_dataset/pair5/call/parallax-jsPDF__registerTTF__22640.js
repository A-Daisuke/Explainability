function __method_wrapper__() {
  TTFFont.prototype.registerTTF = function () {
    var e, hi, low, raw, _ref;
    this.scaleFactor = 1000.0 / this.head.unitsPerEm;
    this.bbox = function () {
      var _i, _len, _ref, _results;
      _ref = this.bbox;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push(Math.round(e * this.scaleFactor));
      }
      return _results;
    }.call(this);
    this.stemV = 0;
    if (this.post.exists) {
      raw = this.post.italic_angle;
      hi = raw >> 16;
      low = raw & 0xff;
      if ((hi & 0x8000) !== 0) {
        hi = -((hi ^ 0xffff) + 1);
      }
      this.italicAngle = +("" + hi + "." + low);
    } else {
      this.italicAngle = 0;
    }
    this.ascender = Math.round(this.ascender * this.scaleFactor);
    this.decender = Math.round(this.decender * this.scaleFactor);
    this.lineGap = Math.round(this.lineGap * this.scaleFactor);
    this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender;
    this.xHeight = this.os2.exists && this.os2.xHeight || 0;
    this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8;
    this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
    this.isScript = this.familyClass === 10;
    this.flags = 0;
    if (this.post.isFixedPitch) {
      this.flags |= 1 << 0;
    }
    if (this.isSerif) {
      this.flags |= 1 << 1;
    }
    if (this.isScript) {
      this.flags |= 1 << 3;
    }
    if (this.italicAngle !== 0) {
      this.flags |= 1 << 6;
    }
    this.flags |= 1 << 5;
    if (!this.cmap.unicode) {
      throw new Error("No unicode cmap for font");
    }
  };

}
