function __method_wrapper__() {
    magic_encode[65001] = function utf8_e(data/*:StrData*/, ofmt/*:?string*/)/*:any*/ {
      if(has_buf && /*::data instanceof Buffer && */Buffer.isBuffer(data)) {
        if(!ofmt || ofmt === 'buf') return data;
        if(ofmt !== 'arr') return data.toString('binary');
        return [].slice.call(data);
      }
/*::
      // data cannot be a buffer at this point
      if(data instanceof Buffer) throw "";
*/
      var len = data.length, w = 0, ww = 0, j = 0;
      var direct = typeof data === "string";
      if(4 * len > mdl) { mdl = 4 * len; mdb = Buffer.allocUnsafe(mdl); }
      for(var i = 0; i < len; ++i) {
        w = direct /*::&& typeof data === "string" */? data.charCodeAt(i) : data[i].charCodeAt(0);
        if(w <= 0x007F) mdb[j++] = w;
        else if(w <= 0x07FF) {
          mdb[j++] = 192 + (w >> 6);
          mdb[j++] = 128 + (w&63);
        } else if(w >= 0xD800 && w <= 0xDFFF) {
          w -= 0xD800; ++i;
          ww = (direct /*::&& typeof data === "string" */? data.charCodeAt(i) : data[i].charCodeAt(0)) - 0xDC00 + (w << 10);
          mdb[j++] = 240 + ((ww>>>18) & 0x07);
          mdb[j++] = 144 + ((ww>>>12) & 0x3F);
          mdb[j++] = 128 + ((ww>>>6) & 0x3F);
          mdb[j++] = 128 + (ww & 0x3F);
        } else {
          mdb[j++] = 224 + (w >> 12);
          mdb[j++] = 128 + ((w >> 6)&63);
          mdb[j++] = 128 + (w&63);
        }
      }
      if(!ofmt || ofmt === 'buf') return mdb.slice(0,j);
      if(ofmt !== 'arr') return mdb.slice(0,j).toString('binary');
      return [].slice.call(mdb, 0, j);
    };

}
