function write_numbers_tma(cfb, deps, ws, tmaroot, tmafile, tmaref) {
  var range = decode_range(ws["!ref"]);
  range.s.r = range.s.c = 0;
  var trunc = false;
  if (range.e.c > 999) {
    trunc = true;
    range.e.c = 999;
  }
  if (range.e.r > 999999) {
    trunc = true;
    range.e.r = 999999;
  }
  if (trunc)
    console.error("Truncating to ".concat(encode_range(range)));
  var data = sheet_to_json(ws, { range: range, header: 1 });
  var SST = ["~Sh33tJ5~"];
  var loc = deps[tmaref].location;
  loc = loc.replace(/^Root Entry\//, "");
  loc = loc.replace(/^Index\//, "").replace(/\.iwa$/, "");
  var pb = parse_shallow(tmaroot.messages[0].data);
  {
    pb[6][0].data = write_varint49(range.e.r + 1);
    pb[7][0].data = write_varint49(range.e.c + 1);
    delete pb[46];
    var store = parse_shallow(pb[4][0].data);
    {
      var row_header_ref = parse_TSP_Reference(parse_shallow(store[1][0].data)[2][0].data);
      numbers_iwa_doit(cfb, deps, row_header_ref, function(rowhead, _x) {
        var _a;
        var base_bucket = parse_shallow(rowhead.messages[0].data);
        if ((_a = base_bucket == null ? void 0 : base_bucket[2]) == null ? void 0 : _a[0])
          for (var R2 = 0; R2 < data.length; ++R2) {
            var _bucket = parse_shallow(base_bucket[2][0].data);
            _bucket[1][0].data = write_varint49(R2);
            _bucket[4][0].data = write_varint49(data[R2].length);
            base_bucket[2][R2] = { type: base_bucket[2][0].type, data: write_shallow(_bucket) };
          }
        rowhead.messages[0].data = write_shallow(base_bucket);
      });
      var col_header_ref = parse_TSP_Reference(store[2][0].data);
      numbers_iwa_doit(cfb, deps, col_header_ref, function(colhead, _x) {
        var base_bucket = parse_shallow(colhead.messages[0].data);
        for (var C = 0; C <= range.e.c; ++C) {
          var _bucket = parse_shallow(base_bucket[2][0].data);
          _bucket[1][0].data = write_varint49(C);
          _bucket[4][0].data = write_varint49(range.e.r + 1);
          base_bucket[2][C] = { type: base_bucket[2][0].type, data: write_shallow(_bucket) };
        }
        colhead.messages[0].data = write_shallow(base_bucket);
      });
      var rbtree = parse_shallow(store[9][0].data);
      rbtree[1] = [];
      var tilestore = parse_shallow(store[3][0].data);
      {
        var tstride = 256;
        tilestore[2] = [{ type: 0, data: write_varint49(tstride) }];
        var tileref = parse_TSP_Reference(parse_shallow(tilestore[1][0].data)[2][0].data);
        var save_token = function() {
          var metadata = numbers_iwa_find(cfb, deps, 2);
          var mlist = parse_shallow(metadata.messages[0].data);
          var mlst = mlist[3].filter(function(m) {
            return varint_to_i32(parse_shallow(m.data)[1][0].data) == tileref;
          });
          return (mlst == null ? void 0 : mlst.length) ? varint_to_i32(parse_shallow(mlst[0].data)[12][0].data) : 0;
        }();
        {
          CFB.utils.cfb_del(cfb, deps[tileref].location);
          numbers_iwa_doit(cfb, deps, 2, function(ai) {
            var mlist = parse_shallow(ai.messages[0].data);
            mlist[3] = mlist[3].filter(function(m) {
              return varint_to_i32(parse_shallow(m.data)[1][0].data) != tileref;
            });
            var parentidx = mlist[3].findIndex(function(m) {
              var _a, _b;
              var mm = parse_shallow(m.data);
              if ((_a = mm[3]) == null ? void 0 : _a[0])
                return u8str(mm[3][0].data) == loc;
              if (((_b = mm[2]) == null ? void 0 : _b[0]) && u8str(mm[2][0].data) == loc)
                return true;
              return false;
            });
            var parent = parse_shallow(mlist[3][parentidx].data);
            if (!parent[6])
              parent[6] = [];
            parent[6] = parent[6].filter(function(m) {
              return varint_to_i32(parse_shallow(m.data)[1][0].data) != tileref;
            });
            mlist[3][parentidx].data = write_shallow(parent);
            ai.messages[0].data = write_shallow(mlist);
          });
          numbers_del_oref(tmaroot, tileref);
        }
        tilestore[1] = [];
        var ntiles = Math.ceil((range.e.r + 1) / tstride);
        for (var tidx = 0; tidx < ntiles; ++tidx) {
          var newtileid = get_unique_msgid({
            deps: [],
            location: "",
            type: 6002
          }, deps);
          deps[newtileid].location = "Root Entry/Index/Tables/Tile-".concat(newtileid, ".iwa");
          var tiledata = [
            [],
            [{ type: 0, data: write_varint49(0) }],
            [{ type: 0, data: write_varint49(Math.min(range.e.r + 1, (tidx + 1) * tstride)) }],
            [{ type: 0, data: write_varint49(0) }],
            [{ type: 0, data: write_varint49(Math.min((tidx + 1) * tstride, range.e.r + 1) - tidx * tstride) }],
            [],
            [{ type: 0, data: write_varint49(5) }],
            [{ type: 0, data: write_varint49(1) }],
            [{ type: 0, data: write_varint49(USE_WIDE_ROWS ? 1 : 0) }]
          ];
          for (var R = tidx * tstride; R <= Math.min(range.e.r, (tidx + 1) * tstride - 1); ++R) {
            var tilerow = write_TST_TileRowInfo(data[R], SST, USE_WIDE_ROWS);
            tilerow[1][0].data = write_varint49(R - tidx * tstride);
            tiledata[5].push({ data: write_shallow(tilerow), type: 2 });
          }
          tilestore[1].push({ type: 2, data: write_shallow([
            [],
            [{ type: 0, data: write_varint49(tidx) }],
            [{ type: 2, data: write_TSP_Reference(newtileid) }]
          ]) });
          var newtile = {
            id: newtileid,
            messages: [write_iwam(6002, write_shallow(tiledata))]
          };
          var tilecontent = compress_iwa_file(write_iwa_file([newtile]));
          CFB.utils.cfb_add(cfb, "/Index/Tables/Tile-".concat(newtileid, ".iwa"), tilecontent);
          numbers_iwa_doit(cfb, deps, 2, function(ai) {
            var mlist = parse_shallow(ai.messages[0].data);
            mlist[3].push({ type: 2, data: write_shallow([
              [],
              [{ type: 0, data: write_varint49(newtileid) }],
              [{ type: 2, data: stru8("Tables/Tile") }],
              [{ type: 2, data: stru8("Tables/Tile-".concat(newtileid)) }],
              [{ type: 2, data: new Uint8Array([2, 0, 0]) }],
              [{ type: 2, data: new Uint8Array([2, 0, 0]) }],
              [],
              [],
              [],
              [],
              [{ type: 0, data: write_varint49(0) }],
              [],
              [{ type: 0, data: write_varint49(save_token) }]
            ]) });
            mlist[1] = [{ type: 0, data: write_varint49(Math.max(newtileid + 1, varint_to_i32(mlist[1][0].data))) }];
            var parentidx = mlist[3].findIndex(function(m) {
              var _a, _b;
              var mm = parse_shallow(m.data);
              if ((_a = mm[3]) == null ? void 0 : _a[0])
                return u8str(mm[3][0].data) == loc;
              if (((_b = mm[2]) == null ? void 0 : _b[0]) && u8str(mm[2][0].data) == loc)
                return true;
              return false;
            });
            var parent = parse_shallow(mlist[3][parentidx].data);
            if (!parent[6])
              parent[6] = [];
            parent[6].push({
              type: 2,
              data: write_shallow([
                [],
                [{ type: 0, data: write_varint49(newtileid) }]
              ])
            });
            mlist[3][parentidx].data = write_shallow(parent);
            ai.messages[0].data = write_shallow(mlist);
          });
          numbers_add_oref(tmaroot, newtileid);
          rbtree[1].push({ type: 2, data: write_shallow([
            [],
            [{ type: 0, data: write_varint49(tidx * tstride) }],
            [{ type: 0, data: write_varint49(tidx) }]
          ]) });
        }
      }
      store[3][0].data = write_shallow(tilestore);
      store[9][0].data = write_shallow(rbtree);
      store[10] = [{ type: 2, data: new Uint8Array([]) }];
      if (ws["!merges"]) {
        var mergeid = get_unique_msgid({
          type: 6144,
          deps: [tmaref],
          location: deps[tmaref].location
        }, deps);
        tmafile.push({
          id: mergeid,
          messages: [write_iwam(6144, write_shallow([
            [],
            ws["!merges"].map(function(m) {
              return { type: 2, data: write_shallow([
                [],
                [{ type: 2, data: write_shallow([
                  [],
                  [{ type: 5, data: new Uint8Array(new Uint16Array([m.s.r, m.s.c]).buffer) }]
                ]) }],
                [{ type: 2, data: write_shallow([
                  [],
                  [{ type: 5, data: new Uint8Array(new Uint16Array([m.e.r - m.s.r + 1, m.e.c - m.s.c + 1]).buffer) }]
                ]) }]
              ]) };
            })
          ]))]
        });
        store[13] = [{ type: 2, data: write_TSP_Reference(mergeid) }];
        numbers_iwa_doit(cfb, deps, 2, function(ai) {
          var mlist = parse_shallow(ai.messages[0].data);
          var parentidx = mlist[3].findIndex(function(m) {
            var _a, _b;
            var mm = parse_shallow(m.data);
            if ((_a = mm[3]) == null ? void 0 : _a[0])
              return u8str(mm[3][0].data) == loc;
            if (((_b = mm[2]) == null ? void 0 : _b[0]) && u8str(mm[2][0].data) == loc)
              return true;
            return false;
          });
          var parent = parse_shallow(mlist[3][parentidx].data);
          if (!parent[6])
            parent[6] = [];
          parent[6].push({
            type: 2,
            data: write_shallow([
              [],
              [{ type: 0, data: write_varint49(mergeid) }]
            ])
          });
          mlist[3][parentidx].data = write_shallow(parent);
          ai.messages[0].data = write_shallow(mlist);
        });
        numbers_add_oref(tmaroot, mergeid);
      } else
        delete store[13];
      var sstref = parse_TSP_Reference(store[4][0].data);
      numbers_iwa_doit(cfb, deps, sstref, function(sstroot) {
        var sstdata = parse_shallow(sstroot.messages[0].data);
        {
          sstdata[3] = [];
          SST.forEach(function(str, i) {
            if (i == 0)
              return;
            sstdata[3].push({ type: 2, data: write_shallow([
              [],
              [{ type: 0, data: write_varint49(i) }],
              [{ type: 0, data: write_varint49(1) }],
              [{ type: 2, data: stru8(str) }]
            ]) });
          });
        }
        sstroot.messages[0].data = write_shallow(sstdata);
      });
    }
    pb[4][0].data = write_shallow(store);
  }
  tmaroot.messages[0].data = write_shallow(pb);
}
