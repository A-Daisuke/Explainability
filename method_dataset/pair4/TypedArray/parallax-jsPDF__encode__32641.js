function __method_wrapper__() {
    LocaTable.prototype.encode = function (offsets, activeGlyphs) {
      var LocaTable = new Uint32Array(this.offsets.length);
      var glyfPtr = 0;
      var listGlyf = 0;
      for (var k = 0; k < LocaTable.length; ++k) {
        LocaTable[k] = glyfPtr;
        if (listGlyf < activeGlyphs.length && activeGlyphs[listGlyf] == k) {
          ++listGlyf;
          LocaTable[k] = glyfPtr;
          var start = this.offsets[k];
          var len = this.offsets[k + 1] - start;
          if (len > 0) {
            glyfPtr += len;
          }
        }
      }
      var newLocaTable = new Array(LocaTable.length * 4);
      for (var j = 0; j < LocaTable.length; ++j) {
        newLocaTable[4 * j + 3] = LocaTable[j] & 0x000000ff;
        newLocaTable[4 * j + 2] = (LocaTable[j] & 0x0000ff00) >> 8;
        newLocaTable[4 * j + 1] = (LocaTable[j] & 0x00ff0000) >> 16;
        newLocaTable[4 * j] = (LocaTable[j] & 0xff000000) >> 24;
      }
      return newLocaTable;
    };

}
