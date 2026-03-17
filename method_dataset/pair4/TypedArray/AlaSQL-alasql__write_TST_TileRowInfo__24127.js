function write_TST_TileRowInfo(data, SST, wide) {
  var _a, _b;
  var tri = [
    [],
    [{ type: 0, data: write_varint49(0) }],
    [{ type: 0, data: write_varint49(0) }],
    [{ type: 2, data: new Uint8Array([]) }],
    [{ type: 2, data: new Uint8Array(Array.from({ length: 510 }, function() {
      return 255;
    })) }],
    [{ type: 0, data: write_varint49(5) }],
    [{ type: 2, data: new Uint8Array([]) }],
    [{ type: 2, data: new Uint8Array(Array.from({ length: 510 }, function() {
      return 255;
    })) }],
    [{ type: 0, data: write_varint49(1) }]
  ];
  if (!((_a = tri[6]) == null ? void 0 : _a[0]) || !((_b = tri[7]) == null ? void 0 : _b[0]))
    throw "Mutation only works on post-BNC storages!";
  var cnt = 0;
  if (tri[7][0].data.length < 2 * data.length) {
    var new_7 = new Uint8Array(2 * data.length);
    new_7.set(tri[7][0].data);
    tri[7][0].data = new_7;
  }
  if (tri[4][0].data.length < 2 * data.length) {
    var new_4 = new Uint8Array(2 * data.length);
    new_4.set(tri[4][0].data);
    tri[4][0].data = new_4;
  }
  var dv = u8_to_dataview(tri[7][0].data), last_offset = 0, cell_storage = [];
  var _dv = u8_to_dataview(tri[4][0].data), _last_offset = 0, _cell_storage = [];
  var width = wide ? 4 : 1;
  for (var C = 0; C < data.length; ++C) {
    if (data[C] == null) {
      dv.setUint16(C * 2, 65535, true);
      _dv.setUint16(C * 2, 65535);
      continue;
    }
    dv.setUint16(C * 2, last_offset / width, true);
    _dv.setUint16(C * 2, _last_offset / width, true);
    var celload, _celload;
    switch (typeof data[C]) {
      case "string":
        celload = write_new_storage({ t: "s", v: data[C] }, SST);
        _celload = write_old_storage({ t: "s", v: data[C] }, SST);
        break;
      case "number":
        celload = write_new_storage({ t: "n", v: data[C] }, SST);
        _celload = write_old_storage({ t: "n", v: data[C] }, SST);
        break;
      case "boolean":
        celload = write_new_storage({ t: "b", v: data[C] }, SST);
        _celload = write_old_storage({ t: "b", v: data[C] }, SST);
        break;
      default:
        if (data[C] instanceof Date) {
          celload = write_new_storage({ t: "s", v: data[C].toISOString() }, SST);
          _celload = write_old_storage({ t: "s", v: data[C].toISOString() }, SST);
          break;
        }
        throw new Error("Unsupported value " + data[C]);
    }
    cell_storage.push(celload);
    last_offset += celload.length;
    {
      _cell_storage.push(_celload);
      _last_offset += _celload.length;
    }
    ++cnt;
  }
  tri[2][0].data = write_varint49(cnt);
  tri[5][0].data = write_varint49(5);
  for (; C < tri[7][0].data.length / 2; ++C) {
    dv.setUint16(C * 2, 65535, true);
    _dv.setUint16(C * 2, 65535, true);
  }
  tri[6][0].data = u8concat(cell_storage);
  tri[3][0].data = u8concat(_cell_storage);
  tri[8] = [{ type: 0, data: write_varint49(wide ? 1 : 0) }];
  return tri;
}
