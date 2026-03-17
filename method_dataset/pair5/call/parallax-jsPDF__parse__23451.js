function __method_wrapper__() {
  PostTable.prototype.parse = function (data) {
    var length, numberOfGlyphs, _results;
    data.pos = this.offset;
    this.format = data.readInt();
    this.italicAngle = data.readInt();
    this.underlinePosition = data.readShort();
    this.underlineThickness = data.readShort();
    this.isFixedPitch = data.readInt();
    this.minMemType42 = data.readInt();
    this.maxMemType42 = data.readInt();
    this.minMemType1 = data.readInt();
    this.maxMemType1 = data.readInt();
    switch (this.format) {
      case 0x00010000:
        break;
      case 0x00020000:
        numberOfGlyphs = data.readUInt16();
        this.glyphNameIndex = [];
        var i;
        for (i = 0; 0 <= numberOfGlyphs ? i < numberOfGlyphs : i > numberOfGlyphs; i = 0 <= numberOfGlyphs ? ++i : --i) {
          this.glyphNameIndex.push(data.readUInt16());
        }
        this.names = [];
        _results = [];
        while (data.pos < this.offset + this.length) {
          length = data.readByte();
          _results.push(this.names.push(data.readString(length)));
        }
        return _results;
      case 0x00025000:
        numberOfGlyphs = data.readUInt16();
        return this.offsets = data.read(numberOfGlyphs);
      case 0x00030000:
        break;
      case 0x00040000:
        return this.map = function () {
          var _j, _ref, _results1;
          _results1 = [];
          for (i = _j = 0, _ref = this.file.maxp.numGlyphs; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
            _results1.push(data.readUInt32());
          }
          return _results1;
        }.call(this);
    }
  };

}
