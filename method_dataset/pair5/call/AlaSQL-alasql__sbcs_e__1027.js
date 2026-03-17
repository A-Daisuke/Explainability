function __method_wrapper__() {
      return function sbcs_e(data/*:StrData*/, ofmt/*:?string*/) {
        var len = data.length;
        var out/*:Buffer*/, i=0, j=0, D=0, w=0;
        if(typeof data === 'string') {
          out = Buffer.allocUnsafe(len);
          for(i = 0; i < len; ++i) out[i] = EE[data.charCodeAt(i)];
        } else if(/*:: data instanceof Buffer && */Buffer.isBuffer(data)) {
          out = Buffer.allocUnsafe(2*len);
          j = 0;
          for(i = 0; i < len; ++i) {
            D = data[i];
            if(D < 128) out[j++] = EE[D];
            else if(D < 224) { out[j++] = EE[((D&31)<<6)+(data[i+1]&63)]; ++i; }
            else if(D < 240) { out[j++] = EE[((D&15)<<12)+((data[i+1]&63)<<6)+(data[i+2]&63)]; i+=2; }
            else {
              w = ((D&7)<<18)+((data[i+1]&63)<<12)+((data[i+2]&63)<<6)+(data[i+3]&63); i+=3;
              if(w < 65536) out[j++] = EE[w];
              else { w -= 65536; out[j++] = EE[0xD800 + ((w>>10)&1023)]; out[j++] = EE[0xDC00 + (w&1023)]; }
            }
          }
          out = out.slice(0,j);
        } else {
          out = Buffer.allocUnsafe(len);
          for(i = 0; i < len; ++i) out[i] = EE[/*::(*/data[i]/*:: :any)*/.charCodeAt(0)];
        }
        if(!ofmt || ofmt === 'buf') return out;
        if(ofmt !== 'arr') return out.toString('binary');
        return [].slice.call(out);
      };

}
