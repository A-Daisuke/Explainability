function __method_wrapper__() {
          numbers_iwa_doit(cfb, deps, 2, function(ai) {
            var mlist = parse_shallow(ai.messages[0].data);
            mlist[3].push({ type: 2, data: write_shallow([
              [],
              [{ type: 0, data: write_varint49(newref) }],
              [{ type: 2, data: stru8(newloc.replace(/-.*$/, "")) }],
              [{ type: 2, data: stru8(newloc) }],
              [{ type: 2, data: new Uint8Array([2, 0, 0]) }],
              [{ type: 2, data: new Uint8Array([2, 0, 0]) }],
              [],
              [],
              [],
              [],
              [{ type: 0, data: write_varint49(0) }],
              [],
              [{ type: 0, data: write_varint49(0) }]
            ]) });
            mlist[1] = [{ type: 0, data: write_varint49(Math.max(newref + 1, varint_to_i32(mlist[1][0].data))) }];
            var parentidx = mlist[3].findIndex(function(m) {
              var _a3, _b2;
              var mm = parse_shallow(m.data);
              if ((_a3 = mm[3]) == null ? void 0 : _a3[0])
                return u8str(mm[3][0].data) == loc;
              if (((_b2 = mm[2]) == null ? void 0 : _b2[0]) && u8str(mm[2][0].data) == loc)
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
                [{ type: 0, data: write_varint49(newref) }]
              ])
            });
            mlist[3][parentidx].data = write_shallow(parent);
            ai.messages[0].data = write_shallow(mlist);
          });

}
